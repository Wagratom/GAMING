import PlayerNicknameAndIcons from './PlayerNicknameAndIcons';
import { useContext, useState } from 'react';
import ChatPrivate from '../../ChatsGame/ChatPrivate/ChatPrivate';
import DinamicProfile from '../DinamicProfile/DinamicProfile';
import { UserData, Players } from '../../InitialPage/Contexts/Contexts';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { TbPingPong } from 'react-icons/tb';

export default function ListFriends({ players, openChat }: { players: Players[], openChat: boolean }) {
	const { user } = useContext(UserData);
	const [userSelectedForDirect, setUserSelectedForDirect] = useState<Players>({} as Players);

	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>(
		{ id: '', nickname: '' }
	);

	function handleOpenChatPrivate(player: Players) {
		if (!openChat) return 

		if (player.nickname === userSelectedForDirect.nickname) {
			setUserSelectedForDirect({} as Players);
		}
		else setUserSelectedForDirect(player)
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
			{userSelectedForDirect.nickname && <ChatPrivate player={userSelectedForDirect} />}
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
							<div className='d-flex w-100' onClick={() => handleOpenChatPrivate(play)}>
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
