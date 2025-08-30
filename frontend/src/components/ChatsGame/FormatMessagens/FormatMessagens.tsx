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
			{messages.map((message: MessageDto) => {
				{
					const data = new Date(message.criando_em)
					const dataFormating: string = `${data.getHours()}:${data.getMinutes()}`;
					if (message.sender.nickname === user.nickname) {
						return (
							<MessageUser
								content={message.content}
								avatarUrl={message.sender.avatar}
								dataFormating={dataFormating}
								nickname={message.sender.nickname}
								id={message.sender.id}
								showDinamicProfile={showDinamicProfile}
								key={message.id}
							/>
						);
					} else {
						return (
							<MessagePeople
								content={message.content}
								avatarUrl={message.sender.avatar}
								dataFormating={dataFormating}
								nickname={message.sender.nickname}
								avatar_name={message.sender.nickname}
								showDinamicProfile={showDinamicProfile}
								id={message.sender.id}
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
