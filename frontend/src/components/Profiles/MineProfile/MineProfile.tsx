import React, { useEffect, useState } from 'react';
import MiniPerfilUser from './MiniPerfilUser';
import Social from './Social';
import OptionsEndBar from './OptionsEndBar';
import ListFriends from './ListFriends';
import './MineProfile.css';
import axios from 'axios';
import { PlayerDto } from '../../InitialPage/Contexts/Contexts';
import NotificacaoUX from './NotificacaoUX';
import webSocketService from '../../webSocketService';

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
};


export default function MiniProfile(props: propsMiniProfile) {
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

	useEffect(() => {
		const socket2 = webSocketService("/topic/login", (nickname: string) => {
			setPlayers((prev) =>
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
		})
		return () => {
			socket.deactivate();
			socket2.deactivate();
		}
	}, []);

	return (
		<div className="position-absolute top-0 end-0 h-100 miniprofile">
			<MiniPerfilUser showMiniPerfil={props.showMiniPerfil} />
			<hr className="m-0 w-100 text-white" />
			<Social setResourcePlayer={setResourcePlayer} />
			{
				resoucePlayer.startsWith("/users") || resoucePlayer.startsWith("/friends")
					? <ListFriends players={players} openChat={resoucePlayer === "/friends?status=ACCEPTED"} />
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
