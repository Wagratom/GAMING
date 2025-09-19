import { BiSolidLock } from 'react-icons/bi';
import { ReactElement, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'js-cookie';
import BannedWarningModal from './BannedWarningModal';
import { chatDto } from '../InitialPage/Contexts/Contexts';

type propsChatList = {
	listChats: chatDto[];
	clickedChat: (chatName: string) => void;
}

export default function ChatList(props: propsChatList) {
	const [showWarningBan, setShowWarningBan] = useState(false);
	const [messageErro, setMessageError] = useState("");

	const getDataChat = (chatName: string, password: string) => {
		return axios.post(`${process.env.REACT_APP_HOST_URL}/chatroom/open-group`, {
			password: password,
			chat_name: chatName,
		}, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420",
			},
		}).then((response) => {
			return response.data;
		});
	}

	const getDataChatPublic = (chatName: string) => {
		getDataChat(chatName, '').then(() => {
			return "teste"
		}).catch((err) => {
			setMessageError(err.response.data.msg)
			setShowWarningBan(true);
		});
	}

	const showModal = (chatName: string) => {
		Swal.fire({
			title: `<h2 style="color:#fff; font-weight:600;">🔒 Sala Protegida</h2>`,
			html: `
			<p style="color:#ccc; margin-bottom:10px;">Digite a senha para entrar na sala <b>${chatName}</b></p>
		`,
			input: 'password',
			inputAttributes: {
				autocapitalize: 'off',
				placeholder: 'Digite a senha aqui...',
				style: 'padding:10px; border-radius:8px; border:1px solid #444; background:#2b2b3d; color:#fff;'
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
				return getDataChat(chatName, password).catch(error => {
					Swal.showValidationMessage(
						`<span style="color:#ff6b6b;">⚠️ ${error.response.data.msg}</span>`
					);
				});
			},
			allowOutsideClick: () => !Swal.isLoading(),
			customClass: {
				popup: 'rounded-4 shadow-lg',
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				props.clickedChat(chatName);
			}
		});
	};


	const divPublicChats = (chat: chatDto): ReactElement => {
		return (
			<div className="col-12 col-md-6 col-lg-4"
				key={chat.id}
				onClick={() => getDataChatPublic(chat.name)}
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
	}

	const divProtectChats = (chat: chatDto): ReactElement => {
		return (
			<div className="col-12 col-md-6 col-lg-4"
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
	}

	if (props.listChats.length === 0) {
		return (
			<div className='w-100 text-center mt-4'>
				<h4 style={{ color: '#ccc' }}>Nenhum chat público disponível no momento.</h4>
				<p style={{ color: '#777' }}>Crie um novo chat ou aguarde até que outros usuários criem chats públicos.</p>
			</div>
		);
	}
	return (
		<div className='row g-0 w-100'>
			{showWarningBan ? <BannedWarningModal showWarningBan={setShowWarningBan} messageError={messageErro} /> : null}
			{props.listChats.map((chat) => (
				chat.type === 'PUBLIC' ? divPublicChats(chat) : divProtectChats(chat)
			))}
		</div>
	);
}
