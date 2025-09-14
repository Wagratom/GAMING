import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../ChatPublic/ChatPublic";
import MessageUser from "./MessageUser";
import MessagePeople from "./MessagePeople";
import { MessageDto, UserData } from "../../InitialPage/Contexts/Contexts";

export default function FormatMessages({ messages }: { messages: MessageDto[] }): JSX.Element {
	const { setDinamicProfile } = useContext(ChatContext);
	const { user } = useContext(UserData);
	const containerRef = useRef<HTMLDivElement>(null);

	// Faz o scroll ir para o final sempre que as mensagens mudam
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);


	if (!messages || messages.length === 0) {
		return <div ref={containerRef} className="h-100 text-black p-3 overflow-auto text-white">
			<p className="text-center">Nenhuma mensagem ainda. Comece uma conversa!</p>
		</div>;
	}

	const showDinamicProfile = (nickname: string, id: string) => {
		setDinamicProfile({ nickName: nickname, id: id });
	}

	const getDateFormating = (date: string) => {
		const data = new Date(date.replace(/\.\d{3,6}/, '.000'));
		const horas = String(data.getHours()).padStart(2, "0");
		const minutos = String(data.getMinutes()).padStart(2, "0");
		return `${horas}:${minutos}`;
	}

	return (
		<div ref={containerRef} className="h-100 text-black p-3 overflow-auto">
			{messages.map((notificacao: MessageDto) => {
				const dateFormating = getDateFormating(notificacao.date)
				if (notificacao.sender.nickname === user.nickname) {
					return <MessageUser notificacao={notificacao} date={dateFormating} _key={notificacao.id} />
				} else {
					return <MessagePeople notificacao={notificacao} date={dateFormating} _key={notificacao.id} />
				};
			})}
		</div>
	)
}
