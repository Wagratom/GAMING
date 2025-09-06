import { useContext } from "react"
import { UserData } from "../../InitialPage/Contexts/Contexts"
import ConnectWebsocket from "../../Profiles/MineProfile/FriendWebsocket";
import { useNavigate } from "react-router-dom";

type PropsButtonPlay = {
	photo: string,
	mode: string,
}

export default function ButtonModelsGame({ photo, mode }: PropsButtonPlay): JSX.Element {
	const { user } = useContext(UserData);
	const navigate = useNavigate();

	// WebSocket para enviar a solicitação de entrar na fila de partida
	const matchRequestClient = ConnectWebsocket("/game/addPlayer", () => {
		console.log("Solicitação de partida enviada com sucesso");
	});

	// WebSocket para receber notificação de partida encontrada
	ConnectWebsocket(`/topic/matchmaking/${user.id}`, (roomId: string) => {
		navigate(`/game/${roomId}`);
	});

	function handleClick() {
		if (matchRequestClient && matchRequestClient.connected) {
			matchRequestClient.publish({
				destination: "/app/game/addPlayer",
				body: JSON.stringify({
					playerId: user.id,
					typeMode: mode
				}),
			});
		}
	}

	return (
		<div
			className="button-models-game"
			onClick={handleClick}
		>
			<div className="button-models-game-photo">
				<img className="h-100 w-100 rounded" src={photo} alt="playPong" />
			</div>
			<button type="button" className="button-models-game-btn">
				{mode}
			</button>
		</div>
	)
}
