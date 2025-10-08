import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import loserImg from "../../../assets/game/loser.jpg";
import winnerImg from "../../../assets/game/winner.jpg";
import { UserData, UserDto } from "../../InitialPage/Contexts/Contexts";
import webSocketService from "../../webSocketService";

type GamePongProps = {
    ball: { positionX: number; positionY: number; size: number };
    paddleLeft: { positionX: number; positionFront: number; height: number; width: number; velocity: number };
    paddleRight: { positionX: number; positionFront: number; height: number; width: number; velocity: number };
    placarLeft: number;
    placarRight: number;
    winner: string;
    window: { height: number; width: number };
    playerLeftId: string;
    playerRightId: string;
    watchs: string[];
    power: { x: number; y: number; size: number };
};

export default function TableGame() {
    //###################################################################
    // Iniciando o jogo
    //####################################################################

    //Varivel responsavel por armazenar as informações do GAME
    const [game, setGame] = useState<GamePongProps>({
        window: { height: 400, width: 600 }, // mesmo do backend
        ball: { positionX: 300, positionY: 200, size: 10 }, // bola e tamanho iguais
        paddleLeft: { positionX: 0, positionFront: 160, height: 80, width: 10, velocity: 5 },
        paddleRight: { positionX: 590, positionFront: 160, height: 80, width: 10, velocity: 5 },
        placarLeft: 0,
        placarRight: 0,
        winner: '',
        playerLeftId: '',
        playerRightId: '',
        watchs: [],
        power: { x: 0, y: 0, size: 0 }
    });

    //conectando no websocket no backend
    const room = useParams().room
    const socketRef = useRef<any>(null);

    useEffect(() => {
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
    }, [room]);

    //Função responsavel por deixar em uma scala diferente para cada munitor
    const backendHeight = useRef<number>(400);

    function scaleGame(gameFromServer: GamePongProps) {
        const scaleFactor = (window.innerHeight * 0.6) / backendHeight.current;
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

    //#############################################################
    //CSS de cria
    //#############################################################
    const paddleStyle = useCallback((paddle: typeof game.paddleLeft) => ({
        height: `${paddle.height}px`,
        width: `${paddle.width}px`,
        backgroundColor: 'white',
        position: 'absolute' as 'absolute',
        top: `${paddle.positionFront}px`,
        left: `${paddle.positionX}px`,
    }), []);


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


    //criando o user como um useRef para não fica recriando toda vez que atualiza a mesa
    const userRef = useRef<UserDto>(useContext(UserData).user);
    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (game.winner) return;
        if (!socketRef.current) return;

        const userId = userRef.current.id;

        if ((e.key === 'w' || e.key === 's') && game.playerLeftId === userId) {
            socketRef.current?.publish({
                destination: "/app/game/move",
                body: JSON.stringify({
                    roomID: room,
                    isLeft: true,
                    isUp: (e.key === 'w')
                }),
            });
        } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && game.playerRightId === userId) {
            socketRef.current?.publish({
                destination: "/app/game/move",
                body: JSON.stringify({
                    roomID: room,
                    isLeft: false,
                    isUp: (e.key === 'ArrowUp')
                }),
            });
        }
    }, [game.winner, game.playerLeftId, game.playerRightId, room]);

    //If que verifica se o game ja acabou
    const navigate = useNavigate();
    if (game.winner) {
        const winnerStyle: React.CSSProperties = {
            backgroundImage: `url(${game.winner === userRef.current.id ? winnerImg : loserImg})`,
            backgroundSize: 'contain',
            backgroundRepeat: "no-repeat",
            backgroundPosition: 'center',
        };

        return (
            <div className="h-100 w-100 d-flex justify-content-center align-items-end" style={winnerStyle}>
                <button className="btn btn-danger" onClick={() => navigate('/game')}>Exit Game</button>
            </div>
        );
    }


    return (
        <div
            id="tableGame"
            tabIndex={0}
            style={{ height: game.window.height, width: game.window.width, position: 'relative', boxShadow: '0px 0px 15px 5px white' }}
            onKeyDown={onKeyDown}
        >
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
    )
}
