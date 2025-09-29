import { useContext, useEffect, useState } from "react";
import { MessageDto, UserData } from "../../InitialPage/Contexts/Contexts";
import FormatMessages from "./FormatMessagens";
import InputChats from "../InputChats";
import BarTitlePublicChat from "./BarTitlePublicChat";
import Configurations from "./Configurations/Configurations";
import webSocketService from "../../webSocketService";

type propsRightSide = {
	chatName: string;
	messages: MessageDto[];
	chatId: string;
	openPageChats: React.Dispatch<React.SetStateAction<string>>;
}

export default function RightSide(props: propsRightSide) {
	const { user } = useContext(UserData)
	const [messages, setMessages] = useState<MessageDto[]>(props.messages);
	const [showConfigurations, setShowConfigurations] = useState(false);

	useEffect(() => {
		if (!user.id) return;

		const socket = webSocketService(
			`/topic/groups/${props.chatId}`,
			(msg: MessageDto) => {
				if (!msg) return;
				setMessages((prev) => [...prev, msg])
			}
		)
		return () => void socket.deactivate();
	}, [props.chatId])

	useEffect(() => {
		setMessages(props.messages);
	}, [props.messages]);


	return (
		<>
			<div>
				<BarTitlePublicChat
					chatName={props.chatName}
					openPageChats={props.openPageChats}
					openOrClosedConf={
						() => setShowConfigurations(!showConfigurations)
					}
				/>
				{!showConfigurations ? null :
					<Configurations
						chatName={props.chatName}
						openOrClosedConf={
							() => setShowConfigurations(!showConfigurations)
						}
					/>
				}
			</div>
			<FormatMessages messages={messages} />
			<InputChats resourceSend={`/add-message-groups/${props.chatId}`} />
		</>
	)
}
