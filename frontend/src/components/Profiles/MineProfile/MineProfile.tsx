import axios from 'axios';
import { useEffect, useState } from 'react';
import bgMineProfile from '../../../assets/game/bgMineProfile.png';
import { PlayerDto } from '../../InitialPage/Contexts/Contexts';
import ListFriends from './ListFriends';
import './MineProfile.css';
import MiniPerfilUser from './MiniPerfilUser';
import NotificacaoUX from './NotificacaoUX';
import OptionsEndBar from './OptionsEndBar';
import Social from './Social';

type propsMiniProfile = {
	showMiniPerfil: (name: string) => void
};

export default function MiniProfile({ showMiniPerfil }: propsMiniProfile) {
	const [resoucePlayer, setResourcePlayer] = useState<string>("/friends?status=ACCEPTED");
	const [players, setPlayers] = useState<PlayerDto[]>([]);

	useEffect(() => {
		if (!resoucePlayer.startsWith("/friends") && !resoucePlayer.startsWith("/users")) return;

		const route = process.env.REACT_APP_API_URL + resoucePlayer;
		axios.get(route, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				setPlayers(res.data);
			})
			.catch(() => { });
	}, [resoucePlayer,]);

	return (
		<div
			style={{ backgroundImage: `url(${bgMineProfile})`, backgroundSize: '100% 100%' }}
			className="position-absolute top-0 end-0 h-100 miniprofile p-4"
			onClick={(event) => event.stopPropagation()}
		>
			<MiniPerfilUser showMiniPerfil={showMiniPerfil} />
			<hr className="m-0 w-100 text-white" />
			<Social setResourcePlayer={setResourcePlayer} />
			{
				resoucePlayer.startsWith("/users") || resoucePlayer.startsWith("/friends")
					? <ListFriends adms={[]} players={players} openChat={resoucePlayer === "/friends?status=ACCEPTED"} />
					: resoucePlayer.startsWith("/notifications")
						? <NotificacaoUX resoucePlayer={resoucePlayer} />
						: null
			}
			<hr className="m-0 w-100 text-white" />
			<OptionsEndBar
				setPlayersList={setPlayers}
				allPlayers={players}
				setResourcePlayer={setResourcePlayer}
			/>
		</div>
	);
}
