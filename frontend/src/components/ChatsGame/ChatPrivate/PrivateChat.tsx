import axios from 'axios';
import FormatMessages from '../FormatMessagens/FormatMessagens';
import TitleChatPrivate from './Title';
import InputChats from '../InputChats';
import { useEffect, useState } from 'react';
import { MessageDto, PlayerDto } from '../../InitialPage/Contexts/Contexts'
import './ChatPrivate.css'
import ConnectWebsocket from '../../Profiles/MineProfile/FriendWebsocket';


export default function PrivateChat({ friend }: { friend: PlayerDto }) {
	const [messages, setMessages] = useState<MessageDto[]>([])

	useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_URL}/directChats/${friend.id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
			withCredentials: true
		})
			.then((res) => {
				console.log("🔔 Mensagens recebidas do servidor: ", res.data);
				setMessages(res.data);
			})
			.catch((err) => {
				if (err.response?.status === 403) {
					console.log("🚫 Usuário não tem permissão para enviar mensagem para esse usuário");
					return;
				}
				console.error("❌ Erro inesperado ao buscar mensagens: ", err);
			});
	}, []);

	const newMessageChat = (msg: string) => {
		setMessages(prev => [...prev, msg as unknown as MessageDto]);
	};
	
	ConnectWebsocket(`/topic/friends/${friend.id}`, newMessageChat);


	return (
		<div className='text-white chat d-flex flex-column bg-degrader' style={{ zIndex: 2000 }}>
			<TitleChatPrivate friend={friend} />
			<div className='p-2 overflow-auto mt-auto text-black' id='messagens-chat'>
				<FormatMessages messages={messages} />
			</div>
			<InputChats
				setMessages={setMessages}
				resourceSend={`/directChats/${friend.id}`}
			/>
		</div>
	);
}
