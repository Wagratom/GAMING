import { useContext } from "react";
import { ChatContext } from "../ChatPublic/ChatPublic";
import MessageUser from "./MessageUser";
import MessagePeople from "./MessagePeople";
import { MessageDto, UserData } from "../../InitialPage/Contexts/Contexts";

export default function FormatMessages({ messages }: { messages: MessageDto[] }): JSX.Element {
	const { setDinamicProfile } = useContext(ChatContext);
	const { user } = useContext(UserData);

	const showDinamicProfile = (nickname: string, id: string) => {
		setDinamicProfile({ nickName: nickname, id: id });
	}

	return (
		<div className="h-100 text-black p-3 overflow-auto">
			{messages.map((notificacao: MessageDto) => {
				{
					const date = new Date(notificacao.date.replace(/\.\d{3,6}/, '.000'));
					const dateFormating: string = `${date.getHours()}:${date.getMinutes()}`;
					if (notificacao.sender.nickname === user.nickname) {
						return (
							<MessageUser notificacao={notificacao} date={dateFormating} />
						);
					} else {
						return (
							<MessagePeople
								notificacao={notificacao}
								date={dateFormating}
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
