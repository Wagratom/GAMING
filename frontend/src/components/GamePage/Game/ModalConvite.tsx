import { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { PlayerDto, UserDto } from "../../InitialPage/Contexts/Contexts";
import webSocketService from "../../webSocketService";

type propsModalConvite = {
	setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
	userInviter: PlayerDto
	me: UserDto
	roomId: string
}

export function ModalConvite({ setOpenChat, userInviter, me, roomId }: propsModalConvite) {
	const cssBackgroundModal: React.CSSProperties = {
		backgroundImage: "url('https://i.pinimg.com/736x/81/60/74/816074bad774e6731e6d9d0d09ce30a6.jpg')",
		backgroundSize: "cover",
		backgroundPosition: "center",
		color: "white",
	}

	const accertPathSocketRef = useRef<any>(null);

	useEffect(() => {
		accertPathSocketRef.current = webSocketService("/topic/game/invite", () => { });
		return () => accertPathSocketRef.current.deactivate()
	}, [])

	if (!userInviter || !roomId) return null

	const invitePath = (): void => {
		if (accertPathSocketRef.current) {
			accertPathSocketRef.current.publish({
				destination: "/app/game/invite/accept",
				body: JSON.stringify({ roomId: roomId, invitedId: me.id }),
			});
		}
	}

	return (
		<Modal show={true} onHide={() => setOpenChat(false)} contentClassName="bankai">
			<Modal.Header closeButton style={cssBackgroundModal} >
				<div style={{ display: 'flex', justifyContent: 'space-between', width: "500px", marginRight: "20px" }}>
					<p className="fs-5 fw-bold">{userInviter.nickname}</p>
					<p className="fs-5 fw-bold">{me.nickname}</p>
				</div>
			</Modal.Header>
			<Modal.Body>
				<p>Convite para partida</p>
				<p className="fs-5 text-center"> {userInviter.nickname} te convidou para jogar! </p>
				<div className='w-100 d-flex pe-3 justify-content-between'>
					<button className="btn btn-primary" onClick={invitePath}> Aceitar </button>
					<button className="btn btn-danger" onClick={() => setOpenChat(false)}> Cancelar </button>
				</div>
			</Modal.Body>
		</Modal>
	)
}
