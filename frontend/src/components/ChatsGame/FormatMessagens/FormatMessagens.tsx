import { useContext, useEffect, useState } from "react";
import { ChatContext, Message } from "../ChatPublic/ChatPublic";
import MessageUser from "./MessageUser";
import MessagePeople from "./MessagePeople";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import ConnectWebsocket from "../../Profiles/MineProfile/FriendWebsocket";
import axios from "axios";

export default function FormatMessages(): JSX.Element {
	const [messages, setMessages] = useState<Message[]>([]);
	const { setDinamicProfile } = useContext(ChatContext);
	const { user } = useContext(UserData);

	const showDinamicProfile = (nickname: string, id: string) => {
		setDinamicProfile({ nickName: nickname, id: id });
	}

	function newNotificationMessages(msg: string) {
		console.log("🔔 Nova notificação de mensagem recebida ", msg)
	}
	// 🔌 Conecta WebSocket passando user.id
	const stompClient = ConnectWebsocket(`/topic/friends/${user.id}{}`, newNotificationMessages);

	useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
			withCredentials: true
		})
			.then(async (res) => {
				if (res.status !== 200) {
					throw new Error('Erro ao buscar dados do usuário');
				}
				const messages: Message[] = await res.data;
				setMessages(messages);
			})
	}, [])

	return (
		<div className="h-100 text-black p-3 overflow-auto">
			{messages.map((message: Message) => {
				{
					const data = new Date(message.date)
					const dataFormating: string = `${data.getHours()}:${data.getMinutes()}`;
					if (message.user.nickname === user.nickname) {
						return (
							<MessageUser
								content={message.content}
								avatarUrl={message.user.avatar}
								dataFormating={dataFormating}
								nickname={message.user.nickname}
								id={message.user.id}
								showDinamicProfile={showDinamicProfile}
								key={message.id}
							/>
						);
					} else {
						return (
							<MessagePeople
								content={message.content}
								avatarUrl={message.user.avatar}
								dataFormating={dataFormating}
								nickname={message.user.nickname}
								avatar_name={message.user.nickname}
								showDinamicProfile={showDinamicProfile}
								id={message.user.id}
								key={message.id}
							/>
						);
					};
				}
			})};
			{/* {props.messageErr === "" ? null :
				<div className="text-center text-white">
					<p>{props.messageErr}</p>
				</div>
			} */}
		</div>
	)
}
