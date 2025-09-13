import React, { SetStateAction, useContext, useEffect, useState } from 'react';
// import bgChats from '../../assets/game/planets/backgrounds/bgChats.jpg'
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoMdClose } from "react-icons/io";
import ChatPublic from '../ChatsGame/ChatPublic/ChatPublic';
import { UserData } from '../InitialPage/Contexts/Contexts';
import BarOptions from './BarOptions';
import ChatList from './ChatsList';
import './PublicChats.css';
import ScreenCreateNewChat from './ScreemCreateNewChat';

export type t_chat = {
	id: string;
	name: string;
	owner_nickname: string;
	photoUrl: string;
	password: string;
	type: string;
	onlines: number;
};

type propsPageChats = {
	openPageChats: React.Dispatch<SetStateAction<string>>;
}

export default function PageChats(props: propsPageChats) {
	const userData = useContext(UserData).user;
	const [chatList, setChatList] = useState<t_chat[]>([]);
	const [showCreateChat, setShowCreateChat] = useState(false);
	const [selectedChat, setSelectedChat] = useState({ click: false, chatName: '' });
	//TODO: Adicionar um variavel para ver se ele esta no privado ou publico

	const getListPublicChats = () => {
		axios.get(`${process.env.REACT_APP_HOST_URL}/chatroom/find-all-public`, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420",
			}
		}).then((res) => {
			setChatList(res.data.chatrooms)
		}).catch(() => { })
	}

	const getListPrivateChats = () => {
		axios.get(`${process.env.REACT_APP_HOST_URL}/chatroom/find-private`, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420",
			}
		}).then((res) => {
			setChatList(res.data.chatrooms)
		}).catch(() => { })
	}


	function handleSearchChats(event: React.ChangeEvent<HTMLInputElement>) {
		let value: string = event.target.value.toLowerCase();

		if (value === '') {
			getListPublicChats();
		}
		else {
			let newList: t_chat[] = [];

			for (const chat of chatList) {
				if (chat.name.toLowerCase().includes(value)) {
					newList.push(chat);
				}
			}
			setChatList(newList);
		}
	}

	function createNewChat(form: FormData) {
		setShowCreateChat(false);
		const nameChatValue = form.get('nameChat');
		const name = nameChatValue?.toString() || '';

		if (name.length <= 0) {
			return;
		}
		const obj = {
			my_id: userData.id,
			name: form.get('nameChat'),
			type: 'public',
			password: form.get('passwordChat'),
			photoUrl: "https://photografos.com.br/wp-content/uploads/2020/09/fotografia-para-perfil.jpg",
		}

		if (form.get('privateChat') === 'private') obj.type = 'private'
		else if (form.get('protectChat') === 'protected') obj.type = 'protected'
	}

	useEffect(() => {
		getListPublicChats()
	}, [])

	const cssDivChats: React.CSSProperties = {
		// backgroundImage: `url(${bgChats})`,
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		color: 'white',
		height: '75%',
		width: '75%',
		padding: '7%'
	}

	if (selectedChat.click === true) return <ChatPublic
		chatName={selectedChat.chatName}
		openPageChats={props.openPageChats}
	/>
	return (
		<div className='rounded position-absolute top-50 start-50 translate-middle'
			style={cssDivChats}
		>
			<IoMdClose
				className="button-close"
				style={{
					backgroundColor: '#46668a',
					boxShadow: `2px 2px 1px #FFF inset, -8px -8px 8px ${'#0c1d3b'} inset`
				}}
				onClick={() => props.openPageChats('')}
			/>

			<div className='d-flex flex-column h-100'>
				<BarOptions
					handleSearchChats={handleSearchChats}
					setShowCreateChat={setShowCreateChat}
					getListPublicChats={getListPublicChats}
					getListPrivateChats={getListPrivateChats}
				/>
				{!showCreateChat ? null :
					<ScreenCreateNewChat
						setShowCreateChat={setShowCreateChat}
						createNewChat={createNewChat}
					/>
				}
				<div className='d-flex p-3 overflow-auto' id='showChats'>
					<ChatList
						listChats={chatList}
						clickedChat={(ChatName: string) => {
							setSelectedChat({ click: true, chatName: ChatName })
						}}
					/>
				</div>
			</div>
		</div>
	)
}
