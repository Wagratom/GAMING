import { Modal } from "react-bootstrap";

type propsModalRules = {
    isOpen: boolean
    closeModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ModalRules({ isOpen, closeModal }: propsModalRules): JSX.Element {
    return (
        <Modal show={isOpen} onHide={() => closeModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Regras Gerais </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>O jogador que fizer 3 pontos primeiro ganha.</p>
                <p>Em caso de desconexão você perde automaticamente.</p>
                <p>O modo normal game possui pooderes</p>
                <p>O modo ranqueado é o padrão pong 1972</p>
                <br></br>

                <h6>Teclas:</h6>
                <div className="d-flex">
                    <div className="w-50">
                        <p>Jogador da diretira</p>
                        <p><u>W</u>&nbsp;subir raquete</p>
                        <p><u>S</u>&nbsp;&nbsp;descer raquete </p>
                    </div>
                    <div >
                        <p>Jogador da esquerda</p>
                        <p>⬆️ subir raquete</p>
                        <p>⬇️ descer raquete </p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => closeModal(false)}>Close</button>
            </Modal.Footer>
        </Modal>
    )
}
