import PlayerNicknameAndIcons from './PlayerNicknameAndIcons';
import { useContext, useState } from 'react';
import PrivateChat from '../../ChatsGame/ChatPrivate/PrivateChat';
import DinamicProfile from '../DinamicProfile/DinamicProfile';
import { UserData, PlayerDto } from '../../InitialPage/Contexts/Contexts';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { TbPingPong } from 'react-icons/tb';

export default function ListFriends({ players, openChat }: { players: PlayerDto[], openChat: boolean }) {
	const { user } = useContext(UserData);
	const [friendSelectedForDirect, setFriendSelectedForDirect] = useState<PlayerDto>({} as PlayerDto);

	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>({ id: '', nickname: '' });

	function handleOpenChatPrivate(player: PlayerDto) {
		if (!openChat) return

		if (player.nickname === friendSelectedForDirect.nickname) {
			setFriendSelectedForDirect({} as PlayerDto);
		}
		else setFriendSelectedForDirect(player)
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
		<div className='text-white overflow-auto h-100'>
			{friendSelectedForDirect.nickname && <PrivateChat friend={friendSelectedForDirect} />}
			{!dinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setDinamicProfile}
					nickName={profileData.nickname}
					id={profileData.id}
				/>
			}

			{/* Map for show players list */}
			{
				players.map((play: PlayerDto) => {
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
									onClick={() => { }}
								/>
							</div>
						</div>
					)
				})}
		</div>
	);
}
