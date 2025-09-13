import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import loserImg from "../../../assets/game/loser.jpg";
import winnerImg from "../../../assets/game/winner.jpg";
import { UserData, UserDto } from "../../InitialPage/Contexts/Contexts";
import webSocketService from "../../webSocketService";
import BarDataUsers from "./BarDataUsers";


type GamePongProps = {
	ball: { positionX: number; positionY: number; size: number };
	paddleLeft: { positionX: number; positionFront: number; height: number; width: number; velocity: number };
	paddleRight: { positionX: number; positionFront: number; height: number; width: number; velocity: number };
	placarLeft: number;
	placarRight: number;
	winner: string;
	window: { height: number; width: number };
	player_left: { id: string; status: boolean; nickname: string };
	player_right: { id: string; status: boolean; nickname: string };
	watchs: string[];
	power: { x: number; y: number; size: number };
};

const backendHeight = 400;

function scaleGame(gameFromServer: GamePongProps) {
	const scaleFactor = (window.innerHeight * 0.6) / backendHeight;
	return {
		...gameFromServer,
		window: {
			width: gameFromServer.window.width * scaleFactor,
			height: gameFromServer.window.height * scaleFactor,
		},
		ball: {
			...gameFromServer.ball,
			positionX: gameFromServer.ball.positionX * scaleFactor,
			positionY: gameFromServer.ball.positionY * scaleFactor,
			size: gameFromServer.ball.size * scaleFactor,
		},
		paddleLeft: {
			...gameFromServer.paddleLeft,
			positionX: gameFromServer.paddleLeft.positionX * scaleFactor,
			positionFront: gameFromServer.paddleLeft.positionFront * scaleFactor,
			height: gameFromServer.paddleLeft.height * scaleFactor,
			width: gameFromServer.paddleLeft.width * scaleFactor,
			velocity: gameFromServer.paddleLeft.velocity * scaleFactor,
		},
		paddleRight: {
			...gameFromServer.paddleRight,
			positionX: gameFromServer.paddleRight.positionX * scaleFactor,
			positionFront: gameFromServer.paddleRight.positionFront * scaleFactor,
			height: gameFromServer.paddleRight.height * scaleFactor,
			width: gameFromServer.paddleRight.width * scaleFactor,
			velocity: gameFromServer.paddleRight.velocity * scaleFactor,
		},

		power: {
			...gameFromServer.power,
			x: gameFromServer.power.x * scaleFactor,
			y: gameFromServer.power.y * scaleFactor,
			size: gameFromServer.power.size * scaleFactor,
		}
	}
}

type LocationState = {
	playerLeft: UserDto;
	playerRight: UserDto;
};

export default function GameWW(): JSX.Element {
	const { user } = useContext(UserData);
	const location = useLocation();
	const navigate = useNavigate();


	const [game, setGame] = useState<GamePongProps>({
		window: { height: 400, width: 600 }, // mesmo do backend
		ball: { positionX: 300, positionY: 200, size: 10 }, // bola e tamanho iguais
		paddleLeft: { positionX: 0, positionFront: 160, height: 80, width: 10, velocity: 5 },
		paddleRight: { positionX: 590, positionFront: 160, height: 80, width: 10, velocity: 5 },
		placarLeft: 0,
		placarRight: 0,
		winner: '',
		player_left: { id: '', status: false, nickname: '' },
		player_right: { id: '', status: false, nickname: '' },
		watchs: [],
		power: { x: 0, y: 0, size: 0 }
	});


	const socketRef = useRef<any>(null);
	const room = useParams().room
	useEffect(() => {
		if (!user.id) return;

		const socket = webSocketService(
			`/topic/game/${room}`,
			(gameUpdate: GamePongProps) => setGame(scaleGame(gameUpdate))
		);

		socketRef.current = webSocketService(
			'/topic/game/move',
			() => { })

		return () => {
			socketRef.current.deactivate();
			socket.deactivate()
		};
	}, [user.id, room]);

	const handleMove = (key: string) => {
		if (!socketRef.current) return;
		if ((key === 'w' || key === 's') && game.player_left.id == user.id) {
			socketRef.current?.publish({
				destination: "/app/game/move",
				body: JSON.stringify({
					roomID: room,
					isLeft: true,
					isUp: (key === 'w')
				}),
			})
		} else if ((key === 'ArrowUp' || key === 'ArrowDown') && game.player_right.id == user.id) {
			socketRef.current?.publish({
				destination: "/app/game/move",
				body: JSON.stringify({
					roomID: room,
					isLeft: false,
					isUp: (key === 'ArrowUp')
				}),
			})
		}
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (game.winner) return;
		if (game.watchs.includes(user.id)) return;
		handleMove(e.key);
	};

	const cssPage: React.CSSProperties = {
		height: '100vh',
		width: '100vw',
		overflow: 'hidden',
		backgroundImage: `url(https://wallpaperaccess.com/full/2513478.jpg)`,
		backgroundSize: 'cover',
	};

	const paddleStyle = (paddle: typeof game.paddleLeft) => ({
		height: `${paddle.height}px`,
		width: `${paddle.width}px`,
		backgroundColor: 'white',
		position: 'absolute' as 'absolute',
		top: `${paddle.positionFront}px`,
		left: `${paddle.positionX}px`,
	});

	const ballStyle: React.CSSProperties = {
		height: `${game.ball.size}px`,
		width: `${game.ball.size}px`,
		backgroundColor: 'white',
		position: 'absolute',
		top: `${game.ball.positionY}px`,
		left: `${game.ball.positionX}px`,
		borderRadius: '50%',
	};

	const powerStyle: React.CSSProperties = game.power.size > 0 ? {
		height: `${game.power.size}px`,
		width: `${game.power.size}px`,
		backgroundColor: 'white',
		position: 'absolute',
		top: `${game.power.y}px`,
		left: `${game.power.x}px`,
		borderRadius: '50%',
	} : {};

	if (game.winner) {
		const winnerStyle: React.CSSProperties = {
			backgroundImage: `url(${game.winner == user.id ? winnerImg : loserImg})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			height: '100vh',
			width: '100vw',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		};

		return (
			<div style={winnerStyle}>
				<button className="btn btn-danger" onClick={() => navigate('/game')}>Exit Game</button>
			</div>
		);
	}

	const { playerLeft, playerRight } = (location.state as LocationState) || {};
	return (
		<div style={cssPage} tabIndex={0} onKeyDown={onKeyDown}>
			<div className="d-flex flex-column justify-content-center align-items-center h-75 container">
				<BarDataUsers
					userLeft={playerLeft}
					userRight={playerRight}
					gameWight={game.window.width}
				/>

				<div style={{ height: game.window.height, width: game.window.width, position: 'relative', boxShadow: '0px 0px 15px 5px white' }}>
					<div style={{ height: game.window.height, width: '2%', backgroundColor: 'white', position: 'absolute', top: 0, left: '50%' }}></div>
					<div style={paddleStyle(game.paddleLeft)}></div>
					<div style={paddleStyle(game.paddleRight)}></div>
					<div style={ballStyle}></div>
					{game.power.size > 0 && <div style={powerStyle}></div>}

					<div className="d-flex position-absolute" style={{ top: 0, width: '100%' }}>
						<div className="w-50 text-white text-center"><p className="fs-1">{game.placarLeft}</p></div>
						<div className="w-50 text-white text-center"><p className="fs-1">{game.placarRight}</p></div>
					</div>
				</div>
			</div>
		</div>
	);
}
