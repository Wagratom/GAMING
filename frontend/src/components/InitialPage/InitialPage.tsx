import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserData, UserDto } from "./Contexts/Contexts";

export default function InicialPage() {
	const [user, setUser] = useState<UserDto>({
		id: "",
		nickname: "",
		avatar: "",
		token: "",
		online: false,
		coins: 0,
		twoFA: false,
		criando_em: "",
	});

	const navigate = useNavigate();
	const retryCount = useRef(0);
	const timeoutId = useRef<NodeJS.Timeout | null>(null);

	const updateDataUser = useCallback((data: Partial<UserDto>) => {
		setUser((prev) => ({ ...prev, ...data }));
	}, []);

	const logout = useCallback(async () => {
		try {
			await axios.patch(
				`${process.env.REACT_APP_API_URL}/logout`,
				{},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
					withCredentials: true,
				}
			);
		} catch (err) {
			console.error("Erro ao desconectar:", err);
		} finally {
			Cookies.remove("jwtToken");
			localStorage.removeItem("token");
			navigate("/bankai");
		}
	}, [navigate]);

	const fetchUserInfo = useCallback(async () => {
		try {
			const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				withCredentials: true,
			});

			if (res.status !== 200) throw new Error("Resposta inesperada");

			updateDataUser(res.data);

			// ✅ sucesso: cancela qualquer retry agendado
			retryCount.current = 0;
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
				timeoutId.current = null;
			}
		} catch (err: any) {
			console.error("Erro ao buscar usuário:", err);

			if (err?.response?.status === 401) {
				alert("Sessão expirada ou não autorizada. Faça login novamente.");
				return navigate("/bankai/login");
			}

			// ✅ apenas em erro agenda nova tentativa
			retryCount.current++;
			let delay = Math.min(60_000, 10_000 * Math.pow(2, retryCount.current - 1));
			if (retryCount.current >= 5) {
				alert("Servidor indisponível. Tentaremos novamente em 1 minuto.");
				delay = 60_000;
			}

			timeoutId.current = setTimeout(fetchUserInfo, delay);
		}
	}, [navigate, updateDataUser]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Você precisa estar logado para acessar esta página.");
			return navigate("/bankai/login");
		}

		// Primeira chamada
		fetchUserInfo();

		return () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
			window.removeEventListener("beforeunload", logout);
		};
	}, [fetchUserInfo, logout, navigate]);

	return (
		<UserData.Provider value={{ user, updateDataUser }}>
			<Outlet />
		</UserData.Provider>
	);
}
