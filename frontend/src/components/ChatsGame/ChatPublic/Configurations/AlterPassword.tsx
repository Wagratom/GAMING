import React, { FormEvent, useContext, useState } from 'react'
import { RiLockPasswordLine } from 'react-icons/ri'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export default function AlterPassword({ funcChange }: {
	funcChange: (form: FormEvent<HTMLFormElement>) => void
}): JSX.Element {

	const [openChat, setOpenChat] = useState<boolean>(false);
	//TODO: Alterar modal do bootstrap para modal lib
	const hadleAlterPassword = (e: React.MouseEvent<HTMLDivElement>) => {
		setOpenChat(true)
	}

	return (
		<>

			<h5 className="p-2 hover" onClick={hadleAlterPassword}>
				<RiLockPasswordLine className="foto-list-friends bg-light text-black me-3 p-1 z-10" size={30} />
				Alterar Senha
			</h5>

			<Modal show={openChat} onHide={() => setOpenChat(false)}>
				<Modal.Header closeButton>
					<RiLockPasswordLine className="foto-list-friends bg-light text-black me-3 p-1 z-10" size={30} />
					Alterar Senha
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={funcChange}>
						<div className="modal-body">
							<div>
								<label htmlFor="password">Confirme Password</label>
								<input name='password' type="password" className="form-control" id="password" placeholder="Password" />
							</div>
							<div>
								<label htmlFor="newPassword">Nova Password</label>
								<input name='newPassword' type="password" className="form-control" id="newPassword" placeholder="Nova Password" />
							</div>
							<div>
								<label htmlFor="confirmNewPassword">Confirme Nova Password</label>
								<input name='confirmNewPassword' type="password" className="form-control" id="confirmNewPassword" placeholder="Confirme Nova Password" />
							</div>
						</div>
					<div className='w-100 d-flex justify-content-end pe-3'>
						<Button type='submit' onClick={() => setOpenChat(false)}> enviar </Button>
					</div>
					</form>
				</Modal.Body>
			</Modal>
		</>

	)
}
