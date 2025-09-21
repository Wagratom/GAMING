import { ChatDataDto, PlayerDto } from '../../InitialPage/Contexts/Contexts'
import { createContext, useContext, useEffect } from 'react';
import { UserData } from '../../InitialPage/Contexts/Contexts';

import React, { useState } from 'react';
import DinamicProfile from '../../Profiles/DinamicProfile/DinamicProfile';
import axios from 'axios';
import Cookies from 'js-cookie';
import RightSide from './RightSide';
import ModalIsBanned from './ModalIsBanned';


type DinamicProfile = {
	nickName: string,
	id: string,
}

export const ChatContext = createContext<{
	chatData: ChatDataDto;
	setDataChat: React.Dispatch<React.SetStateAction<ChatDataDto>>;
	setDinamicProfile: React.Dispatch<React.SetStateAction<DinamicProfile>>;
}>({
	chatData: {} as ChatDataDto,
	setDataChat: () => { },
	setDinamicProfile: () => { }
});


type propsPageChats = {
	openPageChats: React.Dispatch<React.SetStateAction<string>>;
	chatName: string;
}

export default function OpenedPublicChat(props: propsPageChats) {
	const [chatData, setDataChat] = useState<ChatDataDto>({} as ChatDataDto);
	const [dinamicProfile, setDinamicProfile] = useState<DinamicProfile>({} as DinamicProfile);
	const [showDinamicProfile, setShowDinamicProfile] = useState<string>('');
	const userData = useContext(UserData).user;
	const [showModal, setShowModal] = useState<{ show: boolean, msg: String }>({ show: false, msg: "" });

	const createMutedList = (muttedList: any[]) => {
		return muttedList.map((item) => ({ id: item.userId[0].id }))
	}

	function addNewMember(chat_id: String, data: ChatDataDto) {
		data.mutted = createMutedList(data.mutted)
		if (data.members.map((member) => member.nickname).includes(userData.nickname)) {
			return
		} else if (data.banned.map((member) => member.nickname).includes(userData.nickname)) {
			return
		} else if (data.kicked.map((member) => member.nickname).includes(userData.nickname)) {
			return
		}

		// userData.socket?.emit("add-member-group", obj);
	}

	//TODO: Show modal when delete chat

	const getDataChat = () => {
		const ENV = `chat_name=${props.chatName}&password=''`
		axios.get(`${process.env.REACT_APP_HOST_URL}/chatroom/find-public/?${ENV}`, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
			}
		}).then((response) => {
			setDataChat(response.data)
			addNewMember(response.data.id, response.data)
			// userData.socket?.emit("open-group", { chatId: response.data.id });
		}).catch(() => { })
	}

	useEffect(() => {
		getDataChat()
	}, [])

	useEffect(() => {
		if (dinamicProfile.nickName) {
			setShowDinamicProfile('show');
		}
	}, [dinamicProfile])

	const getIsMyId = (id: String, msg: String) => {
		if (userData.id === id)
			setShowModal({ show: true, msg: msg });
		getDataChat();
	}

	//TODO: verificar se o usuario foi banido e manda ele sair
	//Sockets
	// useEffect(() => {
	// 	userData.socket?.on('checkStatus', (data: any) => {
	// 		getDataChat();
	// 	})
	// 	userData.socket?.on('updateChat', (data: any) => {
	// 		getDataChat();
	// 	})

	// 	userData.socket?.on('deleteChat', (message: any) => {
	// 		props.openPageChats("")
	// 		setShowModal({ show: true, msg: message });
	// 	})

	// 	userData.socket?.on('banMember', (obj: any) => {
	// 		getIsMyId(obj.id, obj.msg)
	// 	})

	// 	userData.socket?.on('kickMember', (obj: any) => {
	// 		getIsMyId(obj.id, obj.msg)
	// 	})
	// 	return () => {
	// 		userData.socket?.off('checkStatus')
	// 		userData.socket?.off('updateChat')
	// 		userData.socket?.off('deleteChat')
	// 		userData.socket?.off('banMember')
	// 		userData.socket?.off('kickMember')
	// 	}
	// }, [userData.socket])
	//##############################################################

	if (!chatData.name) {
		console.log("2: ", chatData);
		return <div className='d-flex justify-content-center w-100'>Erro ao abrir o chat </div>
	}


	if (chatData.banned.map((member) => member.nickname).includes(userData.nickname)
		|| chatData.kicked.map((member) => member.nickname).includes(userData.nickname)) {
		return <div>Você foi banido ou expulso deste chat</div>
	}

	if (!chatData) return <div>Carregando...</div>

	// https://vetplus.vet.br/wp-content/uploads/2019/12/img_2427.jpg vc foi chutado
	return (
		<div className="rounded text-white
			position-absolute top-50 start-50 translate-middle h-75 w-75"
		>
			{showModal.show ? <ModalIsBanned openPageChats={props.openPageChats} msg={showModal.msg} /> : null}
			<div className="row g-0 h-100 p-2">
				<ChatContext.Provider value={{ chatData: chatData, setDataChat, setDinamicProfile }}>
					<div className="col-3 border-end h-100">
						{/* <ListFriends
							players={chatData.members}
							getPlayers={() => { }}
							admin={chatData.admin}
							mute={chatData.mutted}
						/> */}
					</div>

					<div className="col-9 d-flex flex-column h-100 position-relative">
						<RightSide
							friend={chatData.members.find((member) => member.nickname !== userData.nickname) as PlayerDto}
							chatName={props.chatName}
							openPageChats={props.openPageChats}
						/>
					</div>
				</ChatContext.Provider>
			</div>


			{!showDinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setShowDinamicProfile}
					id={dinamicProfile.id}
				/>
			}
		</div>
	)
}
