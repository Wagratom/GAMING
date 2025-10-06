import Phaser, { Game as PhaserGame } from "phaser";
import { useContext, useEffect, useRef, useState } from "react";
import GameScene from "./GameScene";

import { UserData, UserDto } from "../../InitialPage/Contexts/Contexts";
import Perfil from "../../Perfil/Perfil";
import DinamicProfile from "../../Profiles/DinamicProfile/DinamicProfile";
import MiniProfile from "../../Profiles/MineProfile/MineProfile";
import PublicsChats from "../../PublicChatsPage/PublicChats";
import Ranking from "../../Rankingpage/Ranking";
import webSocketService from "../../webSocketService";
import ChooseGameMode from "../SettingsGame/ChooseGameMode";
import SettingsStore from "../SettingsStore/SettingsStore";
import { ModalConvite } from "./ModalConvite";
import InviteErro from "./ModalErroInvite";
import { useNavigate } from "react-router-dom";

type responseCreateMatch = {
	roomId: string;
	playerLeft: UserDto;
	playerRight: UserDto;
}

export default function Game() {
	const gameContainerRef = useRef<HTMLDivElement>(null);
	const game = useRef<PhaserGame>();
	const { user } = useContext(UserData);
	const [collisionPnt, setCollisionPnt] = useState("");
	const [openModalConvite, setOpenModalConvite] = useState(false);
	const [userInviter, setUsernviter] = useState<any>({});
	const [erroInvite, setErroInvite] = useState<string>("");
	const navigate = useNavigate();

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


		const socket = webSocketService(`/topic/invite/${user.id}`, (resp: any) => {
			if (resp.msg) {
				setErroInvite(resp.msg)
			} else {
				setUsernviter(resp)
				setOpenModalConvite(true)
			}
		});

		const socket2 = webSocketService(
			`/topic/matchmaking/${user.id}`,
			(response: responseCreateMatch) => {
				navigate(`room/${response.roomId}`, {
					state: {
						playerLeft: response.playerLeft,
						playerRight: response.playerRight
					}
				});
			}
		);

		setCollisionPnt("pntBase")
		return () => {
			game.current?.destroy(true)
			socket?.deactivate();
			socket2?.deactivate();

		}
	}, [user]);

	return (
		<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
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
					{collisionPnt === 'Lua' && <DinamicProfile openDinamicProfile={updateColition} id={user.id} />}
					{collisionPnt === 'pntBase' && <Perfil close={updateColition} />}

					{openModalConvite && (
						<ModalConvite setOpenChat={setOpenModalConvite} me={user} userInviter={userInviter.player} roomId={userInviter.roomId} />
					)}
					{erroInvite && (
						<InviteErro msg={erroInvite} close={setErroInvite} />
					)}
				</div>
			</div>
		</div>
	)
}
