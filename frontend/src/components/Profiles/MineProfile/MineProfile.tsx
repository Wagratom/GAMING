import React, { useEffect, useState } from 'react';
import MiniPerfilUser from './MiniPerfilUser';
import Social from './Social';
import OptionsEndBar from './OptionsEndBar';
import ListFriends from './ListFriends';
import './MineProfile.css';
import axios from 'axios';
import { PlayerDto } from '../../InitialPage/Contexts/Contexts';
import NotificacaoUX from './NotificacaoUX';
import ConnectWebsocket from './FriendWebsocket';

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
};


export default function MiniProfile(props: propsMiniProfile) {
	const [resoucePlayer, setResourcePlayer] = useState<string>("/friends?status=ACCEPTED");
	const [players, setPlayers] = useState<PlayerDto[]>([]);

	const cssMiniprfile: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		backgroundImage: `url('https://s0.smartresize.com/wallpaper/400/885/HD-wallpaper-8-bit-moonlight-8bit-arcade-blue-cloud-moon-pixel.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		height: '100% !important',
		width: '25vw',
	};


	function getPlayers() {
		if (!resoucePlayer.startsWith("/friends") && !resoucePlayer.startsWith("/users")) return;

		const route = process.env.REACT_APP_API_URL + resoucePlayer;
		axios.get(route, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				setPlayers(res.data);
			})
			.catch(() => { });
	}

	useEffect(() => {
		getPlayers();
	}, [resoucePlayer]);

	// Quando usuário loga
	async function loginNewUser(nickname: string) {
		setPlayers((prev) =>
			prev.map((player) =>
				player.nickname === nickname ? { ...player, online: true } : player
			)
		);

	}

	// Quando usuário desloga
	function logoutUser(userId: string) {
		// Marca como inativo em vez de remover
		setPlayers((prev) =>
			prev.map((player) =>
				player.id === userId ? { ...player, online: false } : player
			)
		);
	}

	ConnectWebsocket("/topic/login", loginNewUser);
	ConnectWebsocket("/topic/logout", logoutUser);

	return (
		<div className="position-absolute top-0 end-0 h-100" style={cssMiniprfile}>
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
