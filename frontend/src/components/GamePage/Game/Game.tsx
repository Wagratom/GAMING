import { useContext, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";

import SettingsStore from "../SettingsStore/SettingsStore";
import SettingsPath from "../SettingsGame/SettingsGame";
import Ranking from "../../Rankingpage/Ranking";
import PageChats from "../../PublicChatsPage/PublicChats";
import DinamicProfile from "../../Profiles/DinamicProfile/DinamicProfile";
import MiniProfile from "../../Profiles/MineProfile/MineProfile";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import { ModalConvite } from "./ModalConvite";

export default function Game() {
	const gameContainerRef = useRef<HTMLDivElement>(null);
	const userData = useContext(UserData).user;

	const [collisionPnt, setCollisionPnt] = useState("");
	const [openModalConvite, setOpenModalConvite] = useState(false);
	const [dataConvite, setDataConvite] = useState({} as any);

	useEffect(() => {
		if (!gameContainerRef.current) return;

		const game = new Phaser.Game({
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
		game.scene.start('GameScene', { collisionCallback: setCollisionPnt });

		return () => game.destroy(true);
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
			<div ref={gameContainerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

			{/* Componentes React */}
			{collisionPnt === 'planetLua' && <SettingsStore openSettingsStore={setCollisionPnt} />}
			{collisionPnt === 'planetFire' && <SettingsPath openSettingsPath={setCollisionPnt} />}
			{collisionPnt === 'planetTerra' && <MiniProfile showMiniPerfil={setCollisionPnt} />}
			{collisionPnt === 'satelite' && <PageChats openPageChats={setCollisionPnt} />}
			{collisionPnt === 'base' && <Ranking openStore={setCollisionPnt} />}
			{collisionPnt === 'Lua' && <DinamicProfile openDinamicProfile={setCollisionPnt} nickName={userData.nickname} id={userData.id} />}
			{/* <ModalConvite setOpenChat={setOpenModalConvite} /> */}
			{/* <MiniProfile showMiniPerfil={setCollisionPnt} /> */}
		</div>
	)
}
