import { IoMdClose } from "react-icons/io";
import "./ChooseGameMode.css";
import MatchTypes from "./MatchTypes";

type propsSettingsPath = {
	openSettingsPath:  (name: string) => void;
};

export default function ChooseGameMode(props: propsSettingsPath): JSX.Element {
	return (
		<div className="position-absolute top-50 start-50 translate-middle" style={{ width: '554px' }}>
			{/* Botoes que ficam em cima da janela */}
			<div className="d-flex align-items-center">
				<button className="btn-game-selected">Game</button>
				<button className="btn-game-unselected">Custom</button>
				<IoMdClose
					className="btn-close-custom"
					onClick={() => props.openSettingsPath("")}
				/>
			</div>

			{/* Tipoes de jogos */}
			<div className="game-container text-white">
				<MatchTypes />
				<div className="game-overlay"></div>
			</div>
		</div>
	);
}
