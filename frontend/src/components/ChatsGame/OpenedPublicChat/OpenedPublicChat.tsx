import { createContext, useEffect } from 'react';
import { ChatDataDto } from '../../InitialPage/Contexts/Contexts';

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DinamicProfile from '../../Profiles/DinamicProfile/DinamicProfile';
import ListFriends from '../../Profiles/MineProfile/ListFriends';
import webSocketService from '../../webSocketService';
import ModalIsBanned from './ModalIsBanned';
import RightSide from './RightSide';


type DinamicProfile = { nickName: string, id: string }

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
	openPageChats: (name: string) => void;
	chatId: string;
}

export default function OpenedPublicChat({ chatId, openPageChats }: propsPageChats) {
	const [chatData, setDataChat] = useState<ChatDataDto>({} as ChatDataDto);
	const [dinamicProfile, setDinamicProfile] = useState<DinamicProfile>({} as DinamicProfile);
	const [showDinamicProfile, setShowDinamicProfile] = useState<string>('');
	const [showModal, setShowModal] = useState<{ show: boolean, msg: String }>({ show: false, msg: "" });
	const [showAccessModal, setShowAccessModal] = useState(false);
	const navigate = useNavigate()

	//TODO: ADD NO BACKE
	// function addNewMember(chat_id: String, data: ChatDataDto) {
	// 	axios.post(`${process.env.REACT_APP_API_URL}/groups/${chat_id}/members`, {
	// 		userId: userData.id,
	// 		nickname: userData.nickname,
	// 		photoUrl: userData.photoUrl,
	// 	}, {
	// 		headers: {
	// 			Authorization: `Bearer ${localStorage.getItem("token")}`
	// 		},
	// 	}).then(() => {
	// 		const obj = {
	// 			chatId: chat_id,
	// 			member: {
	// 				id: userData.id,
	// 				nickname: userData.nickname,
	// 				photoUrl: userData.photoUrl,
	// 			},
	// 			admin: data.adms.map((item) => ({ id: item.id })),
	// 			mutted: createMutedList(data.mutted),
	// 		}
	// 		// userData.socket?.emit("add-member-group", obj);
	// 	}).catch(() => { })
	// 	// userData.socket?.emit("add-member-group", obj);
	// }

	// //TODO: Show modal when delete chat

	const getDataChat = () => {
		axios.get(`${process.env.REACT_APP_API_URL}/groups/${chatId}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
		}).then((res) => {
			setDataChat(res.data)
		}).catch((err) => {
			const status = err.response?.status;

			if (status === 401) {
				alert("Sessão expirada ou não autorizada. Por favor, faça login novamente.");
				navigate("/bankai/login");
			}
			if (status === 403) {
				setShowAccessModal(true);
			}
		});
	}

	useEffect(() => {
		getDataChat()
		const socket = webSocketService('topic/updateChat', () => { })

		return () => { socket.deactivate() };
	}, [])

	useEffect(() => {
		if (dinamicProfile.nickName) {
			setShowDinamicProfile('show');
		}
	}, [dinamicProfile])

	//##############################################################

	// if (chatData.banned.map((member) => member.nickname).includes(userData.nickname)
	// 	|| chatData.kicked.map((member) => member.nickname).includes(userData.nickname)) {
	// 	return <div>Você foi banido ou expulso deste chat</div>
	// }

	if (!chatData && !showAccessModal) return <div>Carregando...</div>

	return (
		<div className="rounded text-white position-absolute top-50 start-50 translate-middle h-75 w-75">
			{showModal.show ? <ModalIsBanned openPageChats={openPageChats} msg={showModal.msg} /> : null}
			<div className="row g-0 h-100 p-2">
				<ChatContext.Provider value={{ chatData: chatData, setDataChat, setDinamicProfile }}>
					<div className="col-3 border-end h-100">
						<ListFriends
							players={chatData.members}
							adms={chatData.adms}
							openChat={false}
							membersTitle={true}
						/>
					</div>

					<div className="col-9 d-flex flex-column h-100 position-relative">
						<RightSide
							chatName={chatData.name}
							chatId={chatData.id}
							openPageChats={openPageChats}
							messages={chatData.messages}
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
			{showAccessModal && (
				<div className="access-modal-backdrop">
					<div className="access-modal">
						<p>👮‍♂️ Você não tem acesso a este chat.</p>
						<button onClick={() => setShowAccessModal(false)}>Fechar</button>
					</div>
				</div>
			)}
		</div>
	)
}
