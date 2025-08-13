import { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { UserData, t_dataUser } from './Contexts/Contexts';
import { io, Socket } from 'socket.io-client';

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

	const retryCount = useRef(0);
	const timeoutId = useRef<NodeJS.Timeout | null>(null);
	const socketRef = useRef<Socket | null>(null);

	// Cria a conexão socket e retorna a instância
	function createSocketConnection(id: string): Socket {
		if (socketRef.current) {
			socketRef.current.disconnect();
		}
		const socket = io(process.env.REACT_APP_SOCKET_URL || '', {
			query: { userId: id },
			transports: ['websocket'],
		});
		socketRef.current = socket;
		return socket;
	}

	// Função para buscar dados do usuário com retry e timeout
	function getInfoUser(timeForNewRequestAxios: number) {
		fetch(`${process.env.REACT_APP_API_URL}/profile`, {
			method: 'GET',
			credentials: 'include',
		})
			.then(async (res) => {
				if (!res.ok) throw new Error('Erro na resposta do servidor');

				const data: t_dataUser = await res.json();

				// Cria socket para o usuário
				const socket = createSocketConnection(data.id);
				data.socket = socket;

				setGetInfoUser(data);


				//reiniciando variaveis de controle
				retryCount.current = 0;
				if (timeoutId.current) {
					clearTimeout(timeoutId.current);
					timeoutId.current = null;
				}
			})
			.catch(() => {
				retryCount.current++;
				if (retryCount.current >= 5) {
					alert('O servidor está indisponível no momento, tente novamente mais tarde.');
					retryCount.current = 0;
					timeForNewRequestAxios = 60000;
				}

				// Limpa timeout anterior para evitar múltiplos
				if (timeoutId.current) clearTimeout(timeoutId.current);
				timeoutId.current = setTimeout(() => getInfoUser(timeForNewRequestAxios), timeForNewRequestAxios);
			});
	}

	useEffect(() => {
		getInfoUser(10000);

		// Cleanup quando componente desmonta: limpa timeout e desconecta socket
		return () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
			if (socketRef.current) socketRef.current.disconnect();
		};
	}, []);

	return (
		<UserData.Provider value={{ user: infoUser, updateDataUser: getInfoUser }}>
			<Outlet />
		</UserData.Provider>
	);
}
