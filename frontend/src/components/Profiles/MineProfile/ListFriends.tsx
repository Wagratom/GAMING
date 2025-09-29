import PlayerNicknameAndIcons from './PlayerNicknameAndIcons';
import { useContext, useEffect, useState } from 'react';
import PrivateChat from '../../ChatsGame/ChatPrivate/PrivateChat';
import DinamicProfile from '../DinamicProfile/DinamicProfile';
import { UserData, PlayerDto } from '../../InitialPage/Contexts/Contexts';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { TbPingPong } from 'react-icons/tb';
import webSocketService from '../../webSocketService';

type typeListChat = {
	players: PlayerDto[]
	adms: PlayerDto[]
	openChat: boolean
}

export default function ListFriends({ players, adms, openChat }: typeListChat) {
	const { user } = useContext(UserData);
	const [_players, setPlayers] = useState<PlayerDto[]>(players)
	const [_adms, setAdms] = useState<PlayerDto[]>(adms)
	const [friendSelectedForDirect, setFriendSelectedForDirect] = useState<PlayerDto>({} as PlayerDto);
	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>({ id: '', nickname: '' });


	useEffect(() => {
		setAdms(adms)
		setPlayers(players)

		const socket2 = webSocketService("/topic/login", (nickname: string) => {
			console.log("nickname: ", nickname)
			setPlayers((prev) => {
				console.log("prev: ", prev);
				return prev.map((player) =>
					player.nickname === nickname ? { ...player, online: true } : player
				)
			}
			);

			setAdms((prev) =>
				prev.map((player) =>
					player.nickname === nickname ? { ...player, online: true } : player
				)
			);

		});

		const socket = webSocketService("/topic/logout", (userId: string) => {
			// Marca como inativo em vez de remover
			setPlayers((prev) =>
				prev.map((player) =>
					player.id === userId ? { ...player, online: false } : player
				)
			)

			setAdms((prev) =>
				prev.map((player) =>
					player.id === userId ? { ...player, online: false } : player
				)
			)
		})

		return () => {
			socket.deactivate();
			socket2.deactivate();
		}
	}, [players, adms]);

	function handleOpenChatPrivate(player: PlayerDto) {
		if (!openChat) return

		if (player.nickname === friendSelectedForDirect.nickname) {
			setFriendSelectedForDirect({} as PlayerDto);
		}
		else setFriendSelectedForDirect(player)
	}

	if (!_players || _players.length === 0) {
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
			<div className="border-bottom d-flex align-items-end p-1" style={{ height: "55px" }}>
				<h3 className='text-white'>Membros </h3>
			</div>
			{friendSelectedForDirect.nickname && <PrivateChat friend={friendSelectedForDirect} />}
			{!dinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setDinamicProfile}
					id={profileData.id}
				/>
			}

			{/* Map for show players list */}
			{
				_players.map((play: PlayerDto) => {
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
									callback={() => { setProfileData({ id: play.id, nickname: play.nickname }); setDinamicProfile("open") }}
								/>
								<PlayerNicknameAndIcons
									my_id={user.id}
									player_id={play.id}
									online={play.online}
									name={play.nickname}
									mute={[]}
									admin={_adms}
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
