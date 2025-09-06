import ButtonModelsGame from "./ButtonModelsGame";
import playPong from '../../../assets/settingsGame/playPong.jpg'
import playSpecialPong from '../../../assets/settingsGame/playSpecialPong.jpg'
import bgFire from "../../../assets/game/planets/backgrounds/bgFire.jpg";
import React, { useState } from "react";
import ModalRules from "./ModalRules";

export default function MatchTypes(): JSX.Element {

	const cssDivFilhoSelectGame: React.CSSProperties = {
		position: 'relative',
		zIndex: 2,

		backgroundColor: '#ed9121',
		borderRadius: '1rem',
		boxShadow: '1px 2px 2px black inset, 0px -2px 2px #FFF inset',
		opacity: '1 !important',
		backgroundImage: `url(${bgFire})`,
		backgroundSize: 'cover',
	}

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	return (
		<div style={cssDivFilhoSelectGame}>
			<button onClick={openModal}>Regras do Jogo!</button>
			<ModalRules isOpen={isOpen} closeModal={setIsOpen} />

			<div className="d-flex p-3" id='divOptionsStartGame'>
				<ButtonModelsGame
					photo={playPong}
					mode="Normal"
				/>
				<ButtonModelsGame
					photo={playPong}
					mode="Ranqueado"
				/>
				<ButtonModelsGame
					photo={playPong}
					mode="VS COOP"
				/>
			</div>

			<div className="d-flex p-3">
				<ButtonModelsGame
					photo={playSpecialPong}
					mode="Normal"
				/>
				<ButtonModelsGame
					photo={playSpecialPong}
					mode="Ranqueado"
				/>
				<ButtonModelsGame
					photo={playSpecialPong}
					mode="VS COOP"
				/>
			</div>
		</div>
	)
}
