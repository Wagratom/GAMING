import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";
import ChatPublic from '../ChatsGame/ChatPublic/ChatPublic';
import { chatDto, UserData } from '../InitialPage/Contexts/Contexts';
import ChatList from './ChatsList';
import './PublicChats.css';
import ScreenCreateNewChat from './ScreenCreateNewChat';

type propsPageChats = {
	openPageChats: React.Dispatch<SetStateAction<string>>;
}

export default function PublicsChats({ openPageChats }: propsPageChats) {
	const userData = useContext(UserData).user;
	const [showCreateChat, setShowCreateChat] = useState(false);
	const [selectedChat, setSelectedChat] = useState({ click: false, chatName: '' });
	const [listChats, setListChats] = useState<chatDto[]>([]);

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
		getListChats();
	}, []);

	if (selectedChat.click === true) return <ChatPublic
		chatName={selectedChat.chatName}
		openPageChats={openPageChats}
	/>

	return (
		<div className='rounded position-fixed top-50 start-50 translate-middle public-chats-screen'>
			<IoMdClose
				className="button-close"
				style={{
					backgroundColor: '#46668a',
					boxShadow: `2px 2px 1px #FFF inset, -8px -8px 8px ${'#0c1d3b'} inset`
				}}
				onClick={() => openPageChats('')}
			/>

			<ScreenCreateNewChat
				setShowCreateChat={setShowCreateChat}
				createNewChat={createNewChat}
			/>
			<div className='d-flex flex-column h-100'>
				{/* <BarOptions
					handleSearchChats={handleSearchChats}
					setShowCreateChat={setShowCreateChat}
					getListPublicChats={getListPublicChats}
					getListPrivateChats={getListPrivateChats}
				/>*/}

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
