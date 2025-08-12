import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";
import { UserData, t_dataUser } from './Contexts/Contexts';
import { io } from 'socket.io-client';

export default function InicialPage() {

	const [infoUser, setGetInfoUser] = useState<t_dataUser>({
		nickname: '',
		coins: 0,
		avatar: '',
		id: '',
		twoFA: false,
		avatar_name: '',
		socket: undefined,
	});

	function createSocketConnection(id: string) {
	}

	function getInfoUser(timeForNewRequestAxios: number) {
		let timeout: number = 0;
		
		fetch(`${process.env.REACT_APP_API_URL}/profile`, {
			method: 'GET',
			credentials: 'include'  
		}).then((res: t_dataUser) => {
			let socket = createSocketConnection(res.id);
			res.socket = socket;
			setGetInfoUser(res);

		}).catch(() => {
			timeout++
			if (timeout === 5) {
				alert("O servidor esta indisponivel no momento, tente novamente mais tarde.");
				timeForNewRequestAxios = 60000;
			}
			setTimeout(getInfoUser, timeForNewRequestAxios);
		});
	}

	useEffect(() => {
		getInfoUser(10000);
	}, [])
	return (
		<UserData.Provider value={{ user: infoUser, updateDataUser: getInfoUser }}>
			<Outlet />
		</UserData.Provider>

	);
}
