import { useState } from "react";
import { MessageDto } from "../../InitialPage/Contexts/Contexts";
import BarTitlePublicChat from "./BarTitlePublicChat";
import Configurations from "./Configurations/Configurations";
import MessagensArea from "./MessagensArea";

type propsRightSide = {
	chatName: string;
	message: MessageDto[];
	chatId: string;
	openPageChats: React.Dispatch<React.SetStateAction<string>>;
}

export default function RightSide(props: propsRightSide): JSX.Element {
	const [showConfigurations, setShowConfigurations] = useState(false);

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
			<MessagensArea messages={props.message} chatId={props.chatId}/>

		</>
	)
}
