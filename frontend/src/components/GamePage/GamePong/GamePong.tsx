import { useLocation } from "react-router-dom";
import { CustomScene } from "./Config";
import React, { useContext, useEffect } from 'react';
import { UserData } from "../../InitialPage/Contexts/Contexts";


export default function GamePong(): JSX.Element {
	const dataRoom = useLocation().state?.data as any;
	const gameContainerRef = React.useRef<HTMLDivElement>(null);
	const userData = useContext(UserData).user;

	useEffect(() => {
		if (!gameContainerRef.current) return;
		// if (!dataRoom) return;
		//TODO: Restaurar a logica de lider
		let isLider = false

		if (dataRoom){
			isLider = dataRoom.lider === userData.id;
		}
		const configureGame = new CustomScene(dataRoom, isLider);

		const config = {
			type: Phaser.AUTO,
			parent: gameContainerRef.current,

			width: gameContainerRef.current?.clientWidth || window.innerWidth,
			height: gameContainerRef.current?.clientHeight || window.innerHeight,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0 },
					debug: true
				}
			},
			fps: {
				target: 120,
				forceSetTimeOut: true
			},
			scene: [configureGame]
		};

		const game = new Phaser.Game(config);

		return () => {
			if (game) {
				game.destroy(true);
			}
		};
	}, []);

	return <div ref={gameContainerRef} className="h-100 rounded bg-custon-roxo" />;
};
