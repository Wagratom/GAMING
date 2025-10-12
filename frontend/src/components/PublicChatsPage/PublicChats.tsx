import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import OpenedPublicChat from '../ChatsGame/OpenedPublicChat/OpenedPublicChat';
import { chatDto, UserData } from '../InitialPage/Contexts/Contexts';
import BarOptions from './BarOptions';
import ChatList from './ChatsList';
import './PublicChats.css';
import ScreenCreateNewChat from './ScreenCreateNewChat';
import { IoMdClose } from 'react-icons/io';

type propsRanking = {
	openPublicChat: (name: string) => void;
}

export default function PublicsChats({ openPublicChat }: propsRanking) {
	const { user } = useContext(UserData);
	const [showCreateChat, setShowCreateChat] = useState(false);
	const [listChats, setListChats] = useState<chatDto[]>([])
	const [allChats, setAllChats] = useState<chatDto[]>([])
	const [idOpenedChat, setIdOpenedChat] = useState<string>('');

	const getListChats = () => {
		axios.get(`${process.env.REACT_APP_API_URL}/groups`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				setListChats(res.data)
				setAllChats(res.data)
			})
			.catch(() => { });
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

		axios.post(`${process.env.REACT_APP_API_URL}/groups`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
		})
			.then((res) => {
				setAllChats(prev => [...prev, res.data])
				setListChats(prev => [...prev, res.data])
			})
			.catch(() => { });
	}

	useEffect(() => {
		getListChats();
	}, []);

	if (idOpenedChat) {
		return (
			<OpenedPublicChat
				chatId={idOpenedChat}
				openPageChats={openPublicChat}
			/>
		)
	}

	return (
		<div className='position-fixed top-50 start-50 translate-middle public-chats-screen'>
			<IoMdClose
				className="button-close"
				style={{
					backgroundColor: '#2b2b3d',
					boxShadow: 'rgb(255, 255, 255) 2px 2px 1px inset, rgba(30, 30, 47, 0.95) -8px -8px 8px inset',
					top: '-50px',
					right: '-50px',
				}}
				onClick={() => openPublicChat('')}
			/>
			<div className='d-flex flex-column h-100'>
				<BarOptions
					setShowCreateChat={setShowCreateChat}
					chatList={allChats}
					setChatList={setListChats}
				/>

				{!showCreateChat ? null :
					<ScreenCreateNewChat
						setShowCreateChat={setShowCreateChat}
						createNewChat={createNewChat}
					/>
				}

				<div className='d-flex p-3 overflow-auto' id='showChats'>
					<ChatList listChats={listChats} setIdOpenedChat={setIdOpenedChat} />
				</div>
			</div>
		</div>
	)
}
