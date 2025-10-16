import axios from "axios";
import { useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

type PropsInputChats = {
	resourceSend: string;
};

export default function InputChats({ resourceSend }: PropsInputChats) {
	const inputChat = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const [showAccessModal, setShowAccessModal] = useState(false);

	const sendMessageEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			sendMessage();
		}
		// Deixe a propagação continuar para o documento
		event.stopPropagation();
	};

	const sendMessage = () => {
		const message = inputChat.current?.value?.trim();
		if (!message) return;

		// Limpa o campo antes de enviar
		if (inputChat.current) inputChat.current.value = "";

		axios
			.post(
				`${process.env.REACT_APP_API_URL}${resourceSend}`,
				{ content: message },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
					withCredentials: true,
				}
			)
			.catch((err) => {
				const status = err.response?.status;

				if (status === 401) {
					alert("Sessão expirada ou não autorizada. Por favor, faça login novamente.");
					navigate("/bankai/login");
				}

				if (status === 403) {
					setShowAccessModal(true);
				}
			});
	};

	return (
		<>
			<div className="d-flex align-items-center">
				<input
					className="remove-format-input"
					type="text"
					ref={inputChat}
					placeholder="Digite sua mensagem"
					onKeyDown={sendMessageEnter}
				/>
				<button className="remove-format-button" onClick={sendMessage}>
					<AiOutlineSend size={22} style={{ color: "#808287" }} />
				</button>
			</div>

			{showAccessModal && (
				<div className="access-modal-backdrop">
					<div className="access-modal">
						<p>👮‍♂️ Você não tem acesso a este chat.</p>
						<button onClick={() => setShowAccessModal(false)}>Fechar</button>
					</div>
				</div>
			)}
		</>
	);
}
