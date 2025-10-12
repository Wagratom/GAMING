import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import bgMineProfile from '../../../assets/game/bgMineProfile.png';
import { PlayerDto, UserData } from '../../InitialPage/Contexts/Contexts';
import ListFriends from './ListFriends';
import './MineProfile.css';
import MiniPerfilUser from './MiniPerfilUser';
import NotificacaoUX from './NotificacaoUX';
import OptionsEndBar from './OptionsEndBar';
import Social from './Social';
import webSocketService from '../../webSocketService';

type propsMiniProfile = {
	showMiniPerfil: (name: string) => void
};

type Notifications = {
	sender: PlayerDto;
	receiver: PlayerDto;
};

export default function MiniProfile({ showMiniPerfil }: propsMiniProfile) {
	const [resoucePlayer, setResourcePlayer] = useState<string>("/friends?status=ACCEPTED");
	const [players, setPlayers] = useState<PlayerDto[]>([]);
	const [receivedNotification, setReceivedNotification] = useState<boolean>(false);
	const { user } = useContext(UserData)

	// Busca os jogadores de acordo com o recurso selecionado
	useEffect(() => {
		const route = process.env.REACT_APP_API_URL + resoucePlayer;
		axios.get(route, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				if (resoucePlayer.startsWith("/notifications")) {
					setPlayers(res.data.map((notification: Notifications) => notification.sender));
					setReceivedNotification(false)
				}
				else {
					setPlayers(res.data);
				}
			})
			.catch(() => { });
	}, [resoucePlayer]);

	useEffect(() => {
		const route = `${process.env.REACT_APP_API_URL}/notifications?status=PENDING`;
		axios.get(route, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				if (res.data.length > 0) setReceivedNotification(true)
			})
			.catch(() => { });
	}, []);

	useEffect(() => {
		if (!user.id) return;

		const socket = webSocketService(
			`/topic/friends/${user.id}`,
			(msg: string) => {
				const not = msg as unknown as Notifications
				setPlayers((prev) => [...prev, not.sender])
				setReceivedNotification(true)
			}
		)
		return () => void socket.deactivate();
	}, [user.id])

	return (
		<div
			style={{ backgroundImage: `url(${bgMineProfile})`, backgroundSize: '100% 100%' }}
			className="position-absolute top-0 end-0 h-100 miniprofile p-4"
		>
			<MiniPerfilUser showMiniPerfil={showMiniPerfil} />
			<hr className="m-0 w-100 text-white" />
			<Social setResourcePlayer={setResourcePlayer} />
			{
				resoucePlayer.startsWith("/users") || resoucePlayer.startsWith("/friends")
					? <ListFriends
						adms={[]}
						players={players}
						openChat={resoucePlayer === "/friends?status=ACCEPTED"}
						membersTitle={false}
					/>
					: resoucePlayer.startsWith("/notifications")
						? <NotificacaoUX
							players={players}
							setPlayers={setPlayers}
							setReceivedNotification={setReceivedNotification}
						/>
						: null
			}
			<hr className="m-0 w-100 text-white" />
			<OptionsEndBar
				setPlayersList={setPlayers}
				allPlayers={players}
				setResourcePlayer={setResourcePlayer}
				receivedNotification={receivedNotification}
			/>
		</div>
	);
}
