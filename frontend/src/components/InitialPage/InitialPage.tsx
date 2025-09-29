import { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { UserData, UserDto } from './Contexts/Contexts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
		criando_em: ""
	});

	// Função para atualizar qualquer campo do usuário
	const updateDataUser = (data: Partial<UserDto>) => {
		setUser((prev) => ({ ...prev, ...data }));
	};

	const retryCount = useRef(0);
	const timeoutId = useRef<NodeJS.Timeout | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token: string | null = localStorage.getItem("token");
		if (!token) {
			alert("Você precisa estar logado para acessar esta página.");
			navigate('/')
			return;
		}

		const disconnect = () => {
			const route = `${process.env.REACT_APP_API_URL}/logout`;

			axios.patch(route, {}, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				withCredentials: true,
			})
				.then((res) => {
					if (res.status === 200) {
						Cookies.remove("jwtToken");
						navigate("/");
					}
				})
				.catch((err) => {
					console.error("Erro ao desconectar:", err);
				});
		}


		function getInfoUser(timeForNewRequestAxios: number) {
			axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				withCredentials: true
			})
				.then(async (res) => {
					if (res.status !== 200) {
						throw new Error('Erro ao buscar dados do usuário');
					}

					const data: UserDto = await res.data;
					updateDataUser(data);

					//reiniciando variaveis de controle
					retryCount.current = 0;
					if (timeoutId.current) {
						clearTimeout(timeoutId.current);
						timeoutId.current = null;
					}
				})
				.catch((err) => {
					if (err.response?.status === 401) {
						alert("Sessão expirada ou não autorizada. Por favor, faça login novamente.");
						navigate('/login')
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

		getInfoUser(10000);

		// Cleanup quando componente desmonta: limpa timeout e desconecta socket
		return () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
			disconnect()
		}

	}, [navigate]);

	return (
		<UserData.Provider value={{ user: user, updateDataUser: updateDataUser }}>
			<Outlet />
		</UserData.Provider>
	);
}
