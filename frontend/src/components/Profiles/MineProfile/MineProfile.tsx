import React, { useContext, useEffect, useState } from 'react';
import MiniPerfilUser from './MiniPerfilUser';
import Social from './Social';
import OptionsEndBar from './OptionsEndBar';
import ListFriends from './ListFriends';
import './MineProfile.css';
import axios from 'axios';
import { Players, UserData } from '../../InitialPage/Contexts/Contexts';
import FriendWebsocket from './FriendWebsocket'; 

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
};

export default function MiniProfile(props: propsMiniProfile) {
	const { user } = useContext(UserData);
	const [resoucePlayer, setResourcePlayer] = useState<string>("/friends?status=ACCEPTED");
	const [players, setPlayers] = useState<Players[]>([]);

	// 🔌 Conecta WebSocket passando user.id
	const stompClient = FriendWebsocket(user.id);

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
		const route = process.env.REACT_APP_API_URL + resoucePlayer;
		axios
			.get(route, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			})
			.then((res) => setPlayers(res.data))
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
			<ListFriends players={players} openChat={resoucePlayer === "/friends?status=ACCEPTED"} />
			<hr className="m-0 w-100 text-white" />
			<OptionsEndBar setPlayersList={setPlayers} />
		</div>
	);
}
