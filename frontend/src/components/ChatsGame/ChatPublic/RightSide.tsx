import Configurations from "./Configurations/Configurations";
import BarTitlePublicChat from "./BarTitlePublicChat";
import MessagensArea from "./MessagensArea";
import { useState } from "react";
import { MessageDto, PlayerDto } from "../../InitialPage/Contexts/Contexts";

type propsRightSide = {
	friend: PlayerDto;
	chatName: string;
	message: MessageDto[];
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
				{/* {!showConfigurations ? null :
					<Configurations
						chatName={props.chatName}
						openOrClosedConf={
							() => setShowConfigurations(!showConfigurations)
						}
					/>
				} */}

				<div className="d-flex justify-content-end w-100">
					<Configurations
						chatName={props.chatName}
						openOrClosedConf={
							() => setShowConfigurations(!showConfigurations)
						}
					/>
				</div>
			</div>
			<MessagensArea friend={props.friend} messages={props.message} />

		</>
	)
}
