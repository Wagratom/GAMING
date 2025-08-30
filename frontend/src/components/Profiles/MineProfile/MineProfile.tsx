import React, { useContext, useEffect, useState } from 'react';
import MiniPerfilUser from './MiniPerfilUser';
import Social from './Social';
import OptionsEndBar from './OptionsEndBar';
import ListFriends from './ListFriends';
import './MineProfile.css';
import axios from 'axios';
import { Player, UserData } from '../../InitialPage/Contexts/Contexts';
import NotificacaoUX from './NotificacaoUX';

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
};

type Notifications = {
	sender: Player;
	receiver: Player;
};

export default function MiniProfile(props: propsMiniProfile) {
	const [resoucePlayer, setResourcePlayer] = useState<string>("/friends?status=ACCEPTED");
	const [players, setPlayers] = useState<Player[]>([]);
	const [notifications, setNotifications] = useState<Notifications[]>([]);

	const cssMiniprfile: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		backgroundImage: `url('https://s0.smartresize.com/wallpaper/400/885/HD-wallpaper-8-bit-moonlight-8bit-arcade-blue-cloud-moon-pixel.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		height: '100% !important',
		width: '25vw',
	};

	const removePlayerList = (id: string) => {
		setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== id));
	};

	function getPlayers() {
		const route = process.env.REACT_APP_API_URL + resoucePlayer;
		axios.get(route, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				if (resoucePlayer.startsWith("/notifications")) setNotifications(res.data);
				else if (resoucePlayer.startsWith("/friends") || resoucePlayer.startsWith("/users")) {
					setPlayers(res.data);
				}
			})
			.catch(() => { });
	}

	useEffect(() => {
		getPlayers();
	}, [resoucePlayer]);

	return (
		<div className="position-absolute top-0 end-0 h-100" style={cssMiniprfile}>
			<MiniPerfilUser showMiniPerfil={props.showMiniPerfil} />
			<hr className="m-0 w-100 text-white" />
			<Social setResourcePlayer={setResourcePlayer} />
			{
				resoucePlayer.startsWith("/users") || resoucePlayer.startsWith("/friends")
					? <ListFriends players={players} openChat={resoucePlayer === "/friends?status=ACCEPTED"} />
					: resoucePlayer.startsWith("/notifications")
						? <NotificacaoUX notifications={notifications} removePlayerList={removePlayerList} />
						: null
			}
			<hr className="m-0 w-100 text-white" />
			<OptionsEndBar setPlayersList={setPlayers} setResourcePlayer={setResourcePlayer} />
		</div>
	);
}
