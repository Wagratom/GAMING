import { useContext, useEffect, useState } from "react";
import { ChatContext, Message } from "../ChatPublic/ChatPublic";
import MessageUser from "./MessageUser";
import MessagePeople from "./MessagePeople";
import { Player, UserData } from "../../InitialPage/Contexts/Contexts";
import ConnectWebsocket from "../../Profiles/MineProfile/FriendWebsocket";
import axios from "axios";

export default function FormatMessages({ friend }: { friend: Player }): JSX.Element {
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
	const stompClient = ConnectWebsocket(`/topic/friends/${friend.id}${user.id}{}`, newNotificationMessages);

	useEffect(() => {
		console.log("🔔 Conectando ao WebSocket para mensagens diretas");
		axios.get(`${process.env.REACT_APP_API_URL}/directChats/${friend.id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
			withCredentials: true
		})
			.then((res) => {
				console.log("🔔 Mensagens recebidas do servidor: ", res.data);

				const messages: Message[] = res.data;
				setMessages(messages);
			})
			.catch((err) => {
				if (err.response?.status === 403) {
					console.log("🚫 Usuário não tem permissão para enviar mensagem para esse usuário");
					return;
				}
				console.error("❌ Erro inesperado ao buscar mensagens: ", err);
			});
	}, []);


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
