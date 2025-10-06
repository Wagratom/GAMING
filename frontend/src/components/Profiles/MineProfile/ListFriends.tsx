import { useContext, useEffect, useRef, useState } from 'react';
import { TbPingPong } from 'react-icons/tb';
import PrivateChat from '../../ChatsGame/ChatPrivate/PrivateChat';
import { PlayerDto, UserData } from '../../InitialPage/Contexts/Contexts';
import webSocketService from '../../webSocketService';
import DinamicProfile from '../DinamicProfile/DinamicProfile';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import PlayerNicknameAndIcons from './PlayerNicknameAndIcons';

type typeListChat = {
	players: PlayerDto[]
	adms: PlayerDto[]
	openChat: boolean,
	membersTitle: boolean
}

export default function ListFriends({ players, adms, openChat, membersTitle }: typeListChat) {
	const { user } = useContext(UserData);
	const [_players, setPlayers] = useState<PlayerDto[]>(players)
	const [_adms, setAdms] = useState<PlayerDto[]>(adms)
	const [friendSelectedForDirect, setFriendSelectedForDirect] = useState<PlayerDto>({} as PlayerDto);
	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>({ id: '', nickname: '' });


	// useRef para armazenar os sockets
	const loginSocketRef = useRef<any>(null);
	const logoutSocketRef = useRef<any>(null);

	useEffect(() => {
		setPlayers(players);
		setAdms(adms);

		if (!loginSocketRef.current) {
			loginSocketRef.current = webSocketService("/topic/login", (user: { userId: string }) => {
				const id = user.userId;
				setPlayers(prev => prev.map(p => p.id === id ? { ...p, online: true } : p));
				setAdms(prev => prev.map(p => p.id === id ? { ...p, online: true } : p));
			});
		}

		if (!logoutSocketRef.current) {
			logoutSocketRef.current = webSocketService("/topic/logout", (user: { userId: string }) => {
				const id = user.userId;
				setPlayers(prev => prev.map(p => p.id === id ? { ...p, online: false } : p));
				setAdms(prev => prev.map(p => p.id === id ? { ...p, online: false } : p));
			});
		}


		return () => {
			loginSocketRef.current?.deactivate();
			logoutSocketRef.current?.deactivate();
			loginSocketRef.current = null;
			logoutSocketRef.current = null;
		};
	}, [players, adms]);

	function handleOpenChatPrivate(player: PlayerDto) {
		if (!openChat) return

		if (player.nickname === friendSelectedForDirect.nickname) {
			setFriendSelectedForDirect({} as PlayerDto);
		}
		else setFriendSelectedForDirect(player)
	}

	const invitePath = (playerId: string): void => {
		logoutSocketRef.current.publish({
			destination: "/app/game/invite",
			body: JSON.stringify({ inviterId: user.id, invitedId: playerId }),
		});
	};

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

			{/* abre o direct entre os 2 chats */}
			{friendSelectedForDirect.nickname && <PrivateChat friend={friendSelectedForDirect} />}

			{/* aparacer titulo membros utilados em chats publicos */}
			{membersTitle && (
				<div className="border-bottom d-flex align-items-end p-1" style={{ height: "55px" }}>
					<h3 className='text-white'>Membros </h3>
				</div>
			)}

			{/* abre o profile do usuario ao clicar na foto */}
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
									onClick={() => invitePath(play.id)}
								/>
							</div>
						</div>
					)
				})}
		</div>
	);
}
