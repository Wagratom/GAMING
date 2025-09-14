import { useRef } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import axios from 'axios';

type PropsInputChats = {
	resourceSend: string;
};

export default function InputChats({ resourceSend }: PropsInputChats) {
	const inputChat = useRef<HTMLInputElement>(null);

	const sendMessageEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			sendMessage();
		}
		event.stopPropagation();
	};

	const sendMessage = () => {
		const message = inputChat.current?.value?.trim();
		if (!message) return;

		axios.post(`${process.env.REACT_APP_API_URL}${resourceSend}`,
			{ content: message },
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				withCredentials: true,
			}
		)
			.then(() => {
				if (inputChat.current) {
					inputChat.current.value = "";
				}
			})
			.catch((err) => {
				console.error("❌ Erro ao enviar mensagem:", err);
			});
	};


	return (
		<div className="d-flex align-items-center">
			<input
				className="remove-format-input"
				type="text"
				ref={inputChat}
				placeholder="Digite sua mensagem"
				onKeyDown={sendMessageEnter}
			/>
			<button
				className="remove-format-button"
				onClick={sendMessage}
			>
				<AiOutlineSend size={22} style={{ color: "#808287" }} />
			</button>
		</div>
	);
}
