import Configurations from "./Configurations/Configurations";
import BarConfigurations from "./barConfigurations";
import MessagensArea from "./MessagensArea";
import { useState } from "react";

type propsRightSide = {
	chatName: string;
	openPageChats: React.Dispatch<React.SetStateAction<string>>;
}

export default function RightSide(props: propsRightSide): JSX.Element {
	const [showConfigurations, setShowConfigurations] = useState(false);

	return (
		<>
			<div>
				<BarConfigurations
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
			<MessagensArea />

		</>
	)
}
