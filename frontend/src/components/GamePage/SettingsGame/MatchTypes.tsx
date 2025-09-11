import { useContext, useEffect, useRef, useState } from "react";
import ButtonModelsGame from "./ButtonModelsGame";
import playPong from '../../../assets/settingsGame/playPong.jpg'
import playSpecialPong from '../../../assets/settingsGame/playSpecialPong.jpg'
import ModalRules from "./ModalRules";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import { useNavigate } from "react-router-dom";
import webSocketService from "../../webSocketService";

export default function MatchTypes(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useContext(UserData);
	const matchRequestClientRef = useRef<any>(null);
	const navigate = useNavigate();

	// Só chama o hook depois que user.id estiver disponível
	useEffect(() => {
		matchRequestClientRef.current = webSocketService(
			`/topic/addPlayer/${user.id}`,
			({ message }: { message: string }) => alert(message)
		)

		const socket = webSocketService(
			`/topic/matchmaking/${user.id}`,
			({ roomId }: { roomId: string }) => navigate(`pong/${roomId}`)
		)
		return () => {
			socket.deactivate();
			matchRequestClientRef.current.deactivate();
		}
	}, [user.id])

	function handleClick(mode: string) {
		const client = matchRequestClientRef.current;
		if (client && client.connected) {
			client.publish({
				destination: "/app/game/addPlayer",
				body: JSON.stringify({ playerId: user.id, typeMode: mode }),
			});
		}
	}

	return (
		<div className="div-select-game">
			<button onClick={() => setIsOpen(true)}>Regras do Jogo!</button>
			<ModalRules isOpen={isOpen} closeModal={setIsOpen} />

			<div className="d-flex p-3" id="divOptionsStartGame">
				<ButtonModelsGame photo={playPong} mode="Normal" handleClick={handleClick} />
				<ButtonModelsGame photo={playPong} mode="Ranqueado" handleClick={handleClick} />
				<ButtonModelsGame photo={playPong} mode="VS COOP" handleClick={handleClick} />
			</div>

			<div className="d-flex p-3">
				<ButtonModelsGame photo={playSpecialPong} mode="Normal" handleClick={handleClick} />
				<ButtonModelsGame photo={playSpecialPong} mode="Ranqueado" handleClick={handleClick} />
				<ButtonModelsGame photo={playSpecialPong} mode="VS COOP" handleClick={handleClick} />
			</div>
		</div>
	);
}
