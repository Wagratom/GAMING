import { AiTwotoneSetting } from 'react-icons/ai';
import { LiaWindowClose } from "react-icons/lia";
import React from 'react';

type propsBarConfigurations = {
	openPageChats: React.Dispatch<React.SetStateAction<string>>;
	openOrClosedConf: () => void;
	chatName: string;
}
export default function BarConfigurations(props: propsBarConfigurations) {

	const cssButtons: React.CSSProperties = {
		color: 'white',
		cursor: 'pointer',
		marginLeft: '10px',
	}
	return (
		<div className="border-bottom d-flex align-items-end" style={{ height: "55px" }}>
			<img
				src="https://i.etsystatic.com/37688069/r/il/d3e600/5143421340/il_600x600.5143421340_sm1f.jpg"
				alt="bordão sunny one picie"
				className="foto-list-friends me-2 ms-1"
			/>
			<h3>{props.chatName}</h3>
			<div className="my-auto ms-auto">
				<AiTwotoneSetting
					size={25}
					style={cssButtons}
					onClick={props.openOrClosedConf}
				/>
				<LiaWindowClose
					size={27}
					style={cssButtons}
					onClick={() => props.openPageChats('')}
				/>
			</div>
		</div>
	)
}

