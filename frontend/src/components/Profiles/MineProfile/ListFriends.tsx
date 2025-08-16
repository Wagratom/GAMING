import PlayerNicknameAndIcons from './PlayerNicknameAndIcons';
import { useContext, useState } from 'react';
import ChatPrivate from '../../ChatsGame/ChatPrivate/ChatPrivate';
import DinamicProfile from '../DinamicProfile/DinamicProfile';
import { UserData } from '../../InitialPage/Contexts/Contexts';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { TbPingPong } from 'react-icons/tb';

const mockPlayers: Players[] = [
	{
		avatar: "https://i.pravatar.cc/150?img=1",
		id: "1",
		nickname: "Bankai",
		avatar_name: "SamuraiAvatar",
		online: true,
		match_status: "PLAYING"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=2",
		id: "2",
		nickname: "Kitsune",
		avatar_name: "FoxAvatar",
		online: false,
		match_status: "WATCHING"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=3",
		id: "3",
		nickname: "Akira",
		avatar_name: "NinjaAvatar",
		online: true,
		match_status: "in_game"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
	{
		avatar: "https://i.pravatar.cc/150?img=4",
		id: "4",
		nickname: "Hikari",
		avatar_name: "MageAvatar",
		online: true,
		match_status: "waiting"
	},
];

export type Players = {
	avatar: string,
	id: string,
	nickname: string,
	avatar_name: string,
	online: boolean,
	match_status: string
}

type PropsListFriends = {
	players: Players[],
	getPlayers: (route: string) => void,
	admin?: Players[]
	mute?: { id: string }[]
}

export default function ListFriends(props: PropsListFriends) {
	const { user } = useContext(UserData);
	const [dataOpenDirect, setDataOpenDirect] = useState({ nickname: '', avatar: '' });
	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>(
		{ id: '', nickname: '' }
	);

	function handleOpenChatPrivate(nickname: string, avatar: string) {
		if (dataOpenDirect.nickname === nickname) setDataOpenDirect({ nickname: '', avatar: '' });
		else  setDataOpenDirect({ nickname: nickname, avatar: avatar })
	}

	function clickPhoto(id: string, nickName: string) {
		setDinamicProfile("open")
		setProfileData({ id: id, nickname: nickName })
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

	let type = typeof props.players;
	if (!props.players || type === 'string') {
		return (
			<div>
				<div className='d-flex justify-content-center'>
					<p className='text-white'>Carregando...</p>
				</div>
			</div>
		)
	}
	return (
		<div className='p-2 text-white overflow-auto'>
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
				// props.players.map((play: Players) => {
				mockPlayers.map((play: Players) => {
					if (play.id === user.id) return null
					return (
						<div className='d-flex hover p-1 position relative z-1' key={play.id}>
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
									mute={props.mute ? props.mute : []}
									admin={props.admin ? props.admin : []}
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
