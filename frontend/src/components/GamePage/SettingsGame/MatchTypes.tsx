import { useContext, useState } from "react";
import ButtonModelsGame from "./ButtonModelsGame";
import playPong from '../../../assets/settingsGame/playPong.jpg'
import playSpecialPong from '../../../assets/settingsGame/playSpecialPong.jpg'
import ModalRules from "./ModalRules";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../../Profiles/MineProfile/useWebSocket";

export default function MatchTypes(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useContext(UserData);
	const navigate = useNavigate();

	// Só chama o hook depois que user.id estiver disponível
	const matchRequestClientRef = useWebSocket(
		user?.id ? `/topic/addPlayer/${user.id}` : undefined,
		({ message }: { message: string }) => alert(message)
	)

	useWebSocket(
		user?.id ? `/topic/matchmaking/${user.id}` : undefined,
		({ roomId }: { roomId: string }) => navigate(`game/${roomId}`)
	)
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
