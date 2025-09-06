import ModelsGame from "./ModelsGame";
import { IoMdClose as ButtonClosed } from "react-icons/io";
import "./ChooseGameMode.css";

type propsSettingsPath = {
	openSettingsPath: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChooseGameMode(props: propsSettingsPath): JSX.Element {
	return (
		<div className="position-absolute top-50 start-50 translate-middle">
			<div className="d-flex align-items-center">
				<button className="btn-game-selected">Game</button>
				<button className="btn-game-unselected">Custom</button>
				<ButtonClosed
					className="btn-close-custom"
					onClick={() => props.openSettingsPath("")}
				/>
			</div>

			<div className="game-container text-white">
				<ModelsGame />
				<div className="game-overlay"></div>
			</div>
		</div>
	);
}
