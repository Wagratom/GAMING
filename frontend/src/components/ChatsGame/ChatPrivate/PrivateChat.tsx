import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageDto, PlayerDto, UserData } from '../../InitialPage/Contexts/Contexts';
import PhotoWithOnlineStatus from '../../Profiles/MineProfile/PhotoWithOnlineStatus';
import webSocketService from '../../webSocketService';
import FormatMessages from '../FormatMessagens/FormatMessagens';
import InputChats from '../InputChats';
import './ChatPrivate.css';


export default function PrivateChat({ friend }: { friend: PlayerDto }) {
	const { user } = useContext(UserData)
	const navigate = useNavigate()

	const [messages, setMessages] = useState<MessageDto[]>([])
	const getMessages = () => {
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
				if (err.response.status === 401 || err.response.status === 403) {
					alert("Sessão expirada ou não autorizada. Por favor, faça login novamente.");
					navigate('/')
				}
			})
	}

	const [online, setOnline] = useState<boolean>(friend.online)
	useEffect(() => {
		if (!user?.id) return;

		getMessages()

		const socket = webSocketService("/topic/login", (nickname: string) => {
			if (friend.nickname === nickname) setOnline(true)
		})

		const socket2 = webSocketService("/topic/logout", (userId: string) => {
			if (friend.id === userId) setOnline(false)
		});

		const socket3 = webSocketService(
			`/topic/directChats/${user.id}`,
			(msg: string) => { setMessages(prev => [...prev, msg as unknown as MessageDto]) }
		);
		return () => {
			socket.deactivate();
			socket2.deactivate();
			socket3.deactivate();
		}
	}, [user.id])

	return (
		<div className='text-white chat d-flex flex-column bg-degrader' style={{ zIndex: 2000 }}>

			{/* cabeçario do chat */}
			<div className="p-2 border-bottom d-flex align-items-center" style={{ height: '4rem' }}>
				<PhotoWithOnlineStatus
					online={online}
					imgSrc={friend.avatar}
					photoHeight='2rem'
					photoWidth='2rem'
					positionTop='61%'
					positionEnd='40%'
				/>
				<span className='ms-1 fs-5'>{friend.nickname}</span>
			</div>



			<div className='overflow-auto mt-auto text-black' id='messagens-chat'>
				<FormatMessages messages={messages} />
			</div>
			<InputChats
				resourceSend={`/directChats/${friend.id}`}
			/>
		</div>
	);
}
