import axios from 'axios';
import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import ChatPublic from '../ChatsGame/ChatPublic/ChatPublic';
import { chatDto, UserData } from '../InitialPage/Contexts/Contexts';
import BarOptions from './BarOptions';
import ChatList from './ChatsList';
import './PublicChats.css';
import ScreenCreateNewChat from './ScreenCreateNewChat';

type propsPageChats = {
	openPageChats: React.Dispatch<SetStateAction<string>>;
}

export default function PublicsChats({ openPageChats }: propsPageChats) {
	const { user } = useContext(UserData);
	const [showCreateChat, setShowCreateChat] = useState(false);
	const [selectedChat, setSelectedChat] = useState({ click: false, chatName: '' });
	const [listChats, setListChats] = useState<chatDto[]>([])

	const getListChats = () => {
		axios.get(`${process.env.REACT_APP_API_URL}/groups`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
		}).then((res) => {
			console.log(res.data);
			setListChats(res.data);
		});
	}

	function createNewChat(form: FormData) {
		setShowCreateChat(false);

		// verifica qual checkbox foi marcado
		const type =
			form.get("privateChat")?.toString() || // se público
			form.get("protectChat")?.toString() || // se protegido
			alert("Você deve selecionar um tipo de chat!"); // se nenhum

		const data = {
			chatName: form.get("nameChat")?.toString() || "",
			descricao: "",
			type, // vai ser "PRIVATE" ou "PROTECT"
			chatOwner: user.id,
			password: form.get("passwordChat")?.toString() || null,
			photoUrl: "https://photografos.com.br/wp-content/uploads/2020/09/fotografia-para-perfil.jpg",
		};

		console.log(data);
		axios.post(`${process.env.REACT_APP_API_URL}/groups`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
		}).then((res) => {
			setListChats(prev => [...prev, res.data]);
		}).catch(() => { });
	}

	useEffect(() => {
		getListChats();
	}, []);

	if (selectedChat.click === true) return <ChatPublic
		chatName={selectedChat.chatName}
		openPageChats={openPageChats}
	/>

	return (
		<div className='rounded position-fixed top-50 start-50 translate-middle public-chats-screen'>
			<div className='d-flex flex-column h-100'>
				<BarOptions
					setShowCreateChat={setShowCreateChat}
					chatList={listChats}
					setChatList={setListChats}
				/>

				{!showCreateChat ? null :
					<ScreenCreateNewChat
						setShowCreateChat={setShowCreateChat}
						createNewChat={createNewChat}
					/>
				}

				<div className='d-flex p-3 overflow-auto' id='showChats'>
					<ChatList
						listChats={listChats}
						clickedChat={(ChatName: string) => {
							setSelectedChat({ click: true, chatName: ChatName })
						}}
					/>
				</div>
			</div>
		</div>
	)
}
