import Phaser, { Game as PhaserGame } from "phaser";
import { useContext, useEffect, useRef, useState } from "react";
import GameScene from "./GameScene";

import { PlayerDto, UserData } from "../../InitialPage/Contexts/Contexts";
import DinamicProfile from "../../Profiles/DinamicProfile/DinamicProfile";
import MiniProfile from "../../Profiles/MineProfile/MineProfile";
import PublicsChats from "../../PublicChatsPage/PublicChats";
import Ranking from "../../Rankingpage/Ranking";
import ChooseGameMode from "../SettingsGame/ChooseGameMode";
import SettingsStore from "../SettingsStore/SettingsStore";
import Perfil from "../../Perfil/Perfil";
import webSocketService from "../../webSocketService";

export default function Game() {
	const gameContainerRef = useRef<HTMLDivElement>(null);
	const game = useRef<PhaserGame>();
	const userData = useContext(UserData).user;
	const [collisionPnt, setCollisionPnt] = useState("pntBase");
	const [openModalConvite, setOpenModalConvite] = useState(false);
	const [dataConvite, setDataConvite] = useState({} as any);

	// Variável para guardar o último objeto colidido
	let oldest = "";

	// Função de atualização da colisão
	function updateColition(name: string, isclick?: boolean) {
		// Se o nome for o mesmo do último, não faz nada

		if (name !== "" && oldest === name && isclick !== true) {
			return;
		}
		oldest = name;

		// Reseta a colisão depois de 5 segundos
		setTimeout(() => {
			oldest = "";
		}, 5000);

		setCollisionPnt((prev) => {
			if (game.current) {
				const scene = game.current.scene.getScene("GameScene") as any;

				if (scene && scene.pntGame) {
					// Se clicou no mesmo objeto que já estava ativo, mostra e reseta
					if (prev === name) {
						scene.pntGame.setVisible(true);
						return "";
					}

					// Mostra ou esconde dependendo do planeta
					if (name !== "planetTerra") {
						scene.pntGame.setVisible(true);
					} else {
						scene.pntGame.setVisible(false);
					}
				}
			}
			return name;
		});
	}

	const loginSocketRef = useRef<any>(null);
	useEffect(() => {
		if (!gameContainerRef.current) return;

		game.current = new Phaser.Game({
			type: Phaser.AUTO,
			parent: gameContainerRef.current,
			width: window.innerWidth,
			height: window.innerHeight,
			scene: [GameScene],
			physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: true } },
			scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
			transparent: true,
		});

		// Passa callback para a cena usando dados iniciais
		game.current.scene.start('GameScene', { collisionCallback: updateColition });


		if (!loginSocketRef.current) {
			loginSocketRef.current = webSocketService("/topic/invite-path", (user: PlayerDto) => {
				
			});
		}

		return () => {
			game.current?.destroy(true)
			loginSocketRef.current?.deactivate();
		}
	}, []);

	return (
		<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
			{/* GIF de fundo */}
			<div style={{
				position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
				backgroundImage: `url(${require('../../../assets/game/planets/backgrounds/background3.gif')})`,
				backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0
			}} />

			{/* Container Phaser */}
			<div
				ref={gameContainerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
			>
				{/* Componentes React */}
				<div onClick={(event) => event.stopPropagation()}>
					{collisionPnt === 'planetTerra' && <MiniProfile showMiniPerfil={updateColition} />}
					{collisionPnt === 'planetLua' && <SettingsStore openSettingsStore={updateColition} />}
					{collisionPnt === 'planetGame' && <ChooseGameMode openSettingsPath={updateColition} />}
					{collisionPnt === 'satelite' && <PublicsChats openPublicChat={updateColition} />}
					{collisionPnt === 'base' && <Ranking openStore={updateColition} />}
					{collisionPnt === 'Lua' && <DinamicProfile openDinamicProfile={updateColition} id={userData.id} />}
					{collisionPnt === 'pntBase' && <Perfil close={updateColition} />}

					{/* <ModalConvite setOpenChat={setOpenModalConvite} /> */}
					{/* <MiniProfile showMiniPerfil={setCollisionPnt} /> */}
					{/* <PublicsChats openPublicChat={setCollisionPnt} /> */}
					{/* <DinamicProfile openDinamicProfile={setCollisionPnt} nickName={userData.nickname} id={userData.id} /> */}
				</div>
			</div>
		</div>
	)
}
