import PlayerNicknameAndIcons from './PlayerNicknameAndIcons';
import { useContext, useEffect, useState } from 'react';
import ChatPrivate from '../../ChatsGame/ChatPrivate/ChatPrivate';
import DinamicProfile from '../DinamicProfile/DinamicProfile';
import { UserData } from '../../InitialPage/Contexts/Contexts';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { TbPingPong } from 'react-icons/tb';
import axios from 'axios';

export type Players = {
	avatar: string,
	id: string,
	nickname: string,
	avatar_name: string,
	online: boolean,
	match_status: string
}

export default function ListFriends({ resource }: { resource: string }) {
	const { user } = useContext(UserData);
	const [players, setPlayers] = useState<Players[]>([]);
	const [dataOpenDirect, setDataOpenDirect] = useState({ nickname: '', avatar: '' });
	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>(
		{ id: '', nickname: '' }
	);

	function handleOpenChatPrivate(nickname: string, avatar: string) {
		if (dataOpenDirect.nickname === nickname) setDataOpenDirect({ nickname: '', avatar: '' });
		else setDataOpenDirect({ nickname: nickname, avatar: avatar })
	}

	function clickPhoto(id: string, nickName: string) {
		setDinamicProfile("open")
		setProfileData({ id: id, nickname: nickName })
	}

	function getPlayers() {
		const route = process.env.REACT_APP_API_URL + resource
		axios.get(route, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		}).then((res) => {
			if (res.data.length === 0) {
				setPlayers([]);
				return;
			}
			setPlayers(res.data);
		}).catch(() => { })
	}

	function createMatch(idFriend: string) {
		const obj = {
			myId: user.id,
			myNickname: user.nickname,
			otherId: idFriend,
			msg: "convite"
		}
		user.socket?.emit("sendInvite", obj)
	}

	useEffect(() => {
		getPlayers();
	}, [resource]);

	if (players.length === 0) {
		return (
			<div className='d-flex flex-column justify-content-center align-items-center h-100'>
				<div className='d-flex justify-content-center'>
					<p className='text-white'>Você não tem amigos HA HA</p>
				</div>
			</div>
		)
	}
	return (
		<div className='p-2 text-white overflow-auto h-100'>
			{dataOpenDirect.nickname !== '' && <ChatPrivate nicknameTitle={dataOpenDirect.nickname} avatar={dataOpenDirect.avatar} />}
			{!dinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setDinamicProfile}
					nickName={profileData.nickname}
					id={profileData.id}
				/>
			}

			{/* Map for show players list */}
			{
				players.map((play: Players) => {
					if (play.id === user.id) return null
					return (
						<div className='d-flex hover p-1 position relative z-1 ' key={play.id}>
							<div className='d-flex w-100' onClick={() => handleOpenChatPrivate(play.nickname, play.avatar)}>
								<PhotoWithOnlineStatus
									online={play.online}
									imgSrc={play.avatar}
									photoHeight='2.5rem'
									photoWidth='2.5rem'
									positionTop='70%'
									positionEnd='47%'
								/>
								<PlayerNicknameAndIcons
									my_id={user.id}
									player_id={play.id}
									online={play.online}
									name={play.nickname}
									mute={[]}
									admin={[]}
									match_status={play.match_status}
								/>
							</div>
							<div className='d-flex align-items-center me-1'>
								<TbPingPong
									size={25}
									style={{ color: "#808287" }}
									title='Invite to play'
									onClick={() => createMatch(play.id)}
								/>
							</div>
						</div>
					)
				})}
		</div>
	);
}
