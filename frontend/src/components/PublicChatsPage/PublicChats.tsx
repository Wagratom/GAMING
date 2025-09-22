import axios from 'axios';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import OpenedPublicChat from '../ChatsGame/ChatPublic/OpenedPublicChat';
import { chatDto, UserData } from '../InitialPage/Contexts/Contexts';
import BarOptions from './BarOptions';
import ChatList from './ChatsList';
import './PublicChats.css';
import ScreenCreateNewChat from './ScreenCreateNewChat';

type propsRanking = {
	openPublicChat: React.Dispatch<SetStateAction<string>>;
}

export default function PublicsChats({ openPublicChat }: propsRanking) {
	const { user } = useContext(UserData);
	const [showCreateChat, setShowCreateChat] = useState(false);
	const [listChats, setListChats] = useState<chatDto[]>([])
	const [allChats, setAllChats] = useState<chatDto[]>([])
	const [nameOpenedChat, setIdOpenedChat] = useState<string>('');

	const getListChats = () => {
		axios.get(`${process.env.REACT_APP_API_URL}/groups`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
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

	return (
		<div className='rounded position-fixed top-50 start-50 translate-middle public-chats-screen'>
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
					{nameOpenedChat
						? <OpenedPublicChat chatId={nameOpenedChat} openPageChats={openPublicChat} />
						: <ChatList listChats={listChats} setIdOpenedChat={setIdOpenedChat} />
					}
				</div>
			</div>
		</div>
	)
}
