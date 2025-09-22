import axios from 'axios';
import { SetStateAction, useState } from 'react';
import { BiSolidLock } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { chatDto } from '../InitialPage/Contexts/Contexts';
import BannedWarningModal from './BannedWarningModal';

type PropsChatList = {
	listChats: chatDto[];
	setIdOpenedChat: React.Dispatch<SetStateAction<string>>;
};

export default function ChatList({ setIdOpenedChat, listChats }: PropsChatList) {
	const [showWarningBan, setShowWarningBan] = useState(false);
	const [messageErro, setMessageError] = useState('');
	const navigate = useNavigate();
	const [openedChat, setOpenedChat] = useState<boolean>(false);

	// ---- Função para abrir grupo (público ou protegido) ----
	const OpenGrupo = async (chatName: string, password?: string) => {
		const params = new URLSearchParams({
			chatName,
			...(password ? { password } : {}),
		});

		return axios
			.get(`${process.env.REACT_APP_API_URL}/open-groups?${params.toString()}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				withCredentials: true,
			})
			.then((res) => {
				setIdOpenedChat(res.data.id);
			})
			.catch((err) => {
				console.error('Erro ao abrir grupo:', err.response);
				if (err.response?.status === 401 || err.response?.status === 403) {
					alert('Sessão expirada ou não autorizada. Por favor, faça login novamente.');
					navigate('/login');
				} else {
					console.error('Erro ao abrir o grupo:', err.response?.data);
					setMessageError(err.response?.data?.msg || 'Erro ao abrir o grupo.');
					// setShowWarningBan(true);
				}
				throw err; // importante para o SweetAlert detectar erro
			});
	};


	// ---- Modal para chats protegidos ----
	const showModal = (chatName: string) => {
		Swal.fire({
			title: `<h2 style="color:#fff; font-weight:600;">🔒 Sala Protegida</h2>`,
			html: `<p style="color:#ccc; margin-bottom:10px;">Digite a senha para entrar na sala <b>${chatName}</b></p>`,
			input: 'password',
			inputAttributes: {
				autocapitalize: 'off',
				placeholder: 'Digite a senha aqui...',
				style:
					'padding:10px; border-radius:8px; border:1px solid #444; background:#2b2b3d; color:#fff;',
			},
			background: '#1e1e2f',
			color: '#fff',
			showCancelButton: true,
			showLoaderOnConfirm: true,
			confirmButtonText: '🚀 Entrar',
			cancelButtonText: '❌ Cancelar',
			confirmButtonColor: '#4CAF50',
			cancelButtonColor: '#d33',
			preConfirm: async (password) => {
				return OpenGrupo(chatName, password).catch((error) => {
					Swal.showValidationMessage(
						`<span style="color:#ff6b6b;">⚠️ ${error.response?.data?.msg || 'Senha incorreta'}</span>`
					);
				});
			},
			allowOutsideClick: () => !Swal.isLoading(),
			customClass: {
				popup: 'rounded-4 shadow-lg',
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger',
			},
		});
	};

	// ---- Caso não tenha chats ----
	if (listChats.length === 0) {
		return (
			<div className="w-100 text-center mt-4">
				<h4 style={{ color: '#ccc' }}>Nenhum chat público disponível no momento.</h4>
				<p style={{ color: '#777' }}>
					Crie um novo chat ou aguarde até que outros usuários criem chats públicos.
				</p>
			</div>
		);
	}

	return (
		<div className="row g-0 w-100">
			{showWarningBan && (
				<BannedWarningModal
					showWarningBan={setShowWarningBan}
					messageError={messageErro}
				/>
			)}
			{listChats.map((chat) =>
				chat.type === 'PUBLIC' ?
					(
						<div
							className="col-12 col-md-6 col-lg-4"
							key={chat.id}
							onClick={() => OpenGrupo(chat.name)}
						>
							<div className="chat-card">
								<div className="chat-header">
									<p className="chat-name">{chat.name}</p>
									<span className="chat-onlines">Onlines: {chat.onlines}</span>
								</div>
								<p className="chat-owner">👑 Dono: {chat.owner.nickname}</p>
							</div>
						</div>
					)
					: (
						<div
							className="col-12 col-md-6 col-lg-4"
							key={chat.id}
							onClick={() => showModal(chat.name)}
						>
							<div className="chat-card">
								<div className="chat-header">
									<p className="chat-name">{chat.name}</p>
									<span className="chat-onlines">
										Onlines: {chat.onlines}
										<BiSolidLock className="lock-icon" />
									</span>
								</div>
								<p className="chat-owner">👑 Dono: {chat.owner.nickname}</p>
							</div>
						</div>
					)
			)}
		</div>
	);
}
