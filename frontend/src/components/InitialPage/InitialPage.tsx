import { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { UserData, UserDto } from './Contexts/Contexts';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

export default function InicialPage() {

	// Estado para armazenar as informações do usuário
	const [user, setUser] = useState<UserDto>({
		id: "",
		nickname: "",
		avatar: "",
		token: "",
		online: false,
		coins: 0,
		twoFA: false,
		socket: undefined,
		criando_em: ""
	});

	// Função para atualizar qualquer campo do usuário
	const updateDataUser = (data: Partial<UserDto>) => {
		setUser((prev) => ({ ...prev, ...data }));
	};

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
			axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				withCredentials: true
			})
			.then(async (res) => {
				if (res.status !== 200) {
					throw new Error('Erro ao buscar dados do usuário');
				}
				
				const data: UserDto = await res.data;
				updateDataUser(data);
				// Cria socket para o usuário
				const socket = createSocketConnection(data.id);
				data.socket = socket;


				//reiniciando variaveis de controle
				retryCount.current = 0;
				if (timeoutId.current) {
					clearTimeout(timeoutId.current);
					timeoutId.current = null;
				}
			})
			.catch((err) => {
				if (err.response.status === 401 || err.response.status === 403) {
					alert("Sessão expirada ou não autorizada. Por favor, faça login novamente.");
					window.location.href = "/";
					return;
				}
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
		const token: string | null = localStorage.getItem("token");
		if (!token) {
			alert("Você precisa estar logado para acessar esta página.");
			window.location.href = "/";
			return;
		}

		getInfoUser(10000);

		// Cleanup quando componente desmonta: limpa timeout e desconecta socket
		return () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
			if (socketRef.current) socketRef.current.disconnect();
		};
	}, []);

	console.log("User: ", user)
	return (
		<UserData.Provider value={{ user: user, updateDataUser: updateDataUser }}>
			<Outlet />
		</UserData.Provider>
	);
}
