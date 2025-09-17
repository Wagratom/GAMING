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
	const [listChats, setListChats] = useState<chatDto[]>([
		{
			id: "1",
			name: "Cinema Lovers",
			owner_nickname: "alice",
			photoUrl: "https://picsum.photos/200/200?1",
			password: "",
			type: "PUBLIC",
			onlines: 12,
		},
		{
			id: "2",
			name: "Gamers Unite",
			owner_nickname: "bob",
			photoUrl: "https://picsum.photos/200/200?2",
			password: "1234",
			type: "PROTECT",
			onlines: 8,
		},
		{
			id: "3",
			name: "Música ao Vivo",
			owner_nickname: "carol",
			photoUrl: "https://picsum.photos/200/200?3",
			password: "",
			type: "PUBLIC",
			onlines: 21,
		},
		{
			id: "4",
			name: "Café & Código",
			owner_nickname: "david",
			photoUrl: "https://picsum.photos/200/200?4",
			password: "coffee",
			type: "PROTECT",
			onlines: 5,
		},
		{
			id: "5",
			name: "Viagem pelo Mundo",
			owner_nickname: "eve",
			photoUrl: "https://picsum.photos/200/200?5",
			password: "",
			type: "PUBLIC",
			onlines: 18,
		},
		{
			id: "6",
			name: "Estudos Dev",
			owner_nickname: "frank",
			photoUrl: "https://picsum.photos/200/200?6",
			password: "springboot",
			type: "PROTECT",
			onlines: 7,
		},
		{
			id: "7",
			name: "Clube do Livro",
			owner_nickname: "grace",
			photoUrl: "https://picsum.photos/200/200?7",
			password: "",
			type: "PUBLIC",
			onlines: 14,
		},
		{
			id: "8",
			name: "Fitness Life",
			owner_nickname: "henry",
			photoUrl: "https://picsum.photos/200/200?8",
			password: "gym2025",
			type: "PROTECT",
			onlines: 9,
		},
		{
			id: "9",
			name: "Fotografia Criativa",
			owner_nickname: "isabel",
			photoUrl: "https://picsum.photos/200/200?9",
			password: "",
			type: "PUBLIC",
			onlines: 16,
		},
		{
			id: "10",
			name: "DevOps Masters",
			owner_nickname: "jack",
			photoUrl: "https://picsum.photos/200/200?10",
			password: "awsrocks",
			type: "PROTECT",
			onlines: 11,
		},
		
	]);

	const getListChats = () => {
		axios.get(`${process.env.REACT_APP_API_URL}/publicChats`, {
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
			"PUBLIC"; // default caso nenhum marcado

		const obj = {
			name: form.get("nameChat")?.toString() || "",
			owner: user.id,
			type, // vai ser "PRIVATE" ou "PROTECT"
			descricao: "",
			password: form.get("passwordChat")?.toString() || null,
			photoUrl: "https://photografos.com.br/wp-content/uploads/2020/09/fotografia-para-perfil.jpg",
		};

		console.log(obj);
	}

	useEffect(() => {
		// getListChats();
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
