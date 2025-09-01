import axios from 'axios';
import FormatMessages from '../FormatMessagens/FormatMessagens';
import TitleChatPrivate from './Title';
import InputChats from '../InputChats';
import { useContext, useEffect, useState } from 'react';
import { MessageDto, PlayerDto, UserData } from '../../InitialPage/Contexts/Contexts'
import './ChatPrivate.css'
import ConnectWebsocket from '../../Profiles/MineProfile/FriendWebsocket';
import { useNavigate } from 'react-router-dom';


export default function PrivateChat({ friend }: { friend: PlayerDto }) {
	const { user } = useContext(UserData)
	const [messages, setMessages] = useState<MessageDto[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_URL}/directChats/${friend.id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
			withCredentials: true
		})
			.then((res) => {
				setMessages(res.data.messages);
			})
			.catch((err) => {
				console.error("Erro ao buscar dados do usuário:", err.response);
				if (err.response.status === 401 || err.response.status === 403) {
					alert("Sessão expirada ou não autorizada. Por favor, faça login novamente.");
					navigate('/')
					return;
				}
			})
	})

	const newMessageChat = (msg: string) => {
		setMessages(prev => [...prev, msg as unknown as MessageDto]);
	};

	ConnectWebsocket(`/topic/directChats/${user.id}`, newMessageChat);


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
