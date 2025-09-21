import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import React from 'react';

type propsBannedWarningModal = {
	showWarningBan: React.Dispatch<React.SetStateAction<boolean>>;
	messageError: String;
}

export default function BannedWarningModal(props: propsBannedWarningModal) {

	return (
		<Modal show={true} className="banned-modal" centered>
			<Modal.Header closeButton onHide={() => props.showWarningBan(false)}>
				<Modal.Title>{props.messageError} 👮</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="d-flex justify-content-center">
					<img
						src="https://ae01.alicdn.com/kf/HTB1pr2tSXXXXXabXXXXq6xXFXXXH.jpg_640x640Q90.jpg_.webp"
						alt="Foto de cachorro vestido de policial"
					/>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={() => props.showWarningBan(false)}
				>
					Fui mlk 😅
				</Button>
			</Modal.Footer>
		</Modal>

	)
}
