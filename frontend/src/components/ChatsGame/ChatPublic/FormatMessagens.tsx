import { useContext, useEffect, useRef } from "react";
import { MessageDto, UserData } from "../../InitialPage/Contexts/Contexts";

export default function FormatMessages({ messages }: { messages: MessageDto[] }): JSX.Element {
	const { user } = useContext(UserData);
	const containerRef = useRef<HTMLDivElement>(null);

	// Faz o scroll ir para o final sempre que as mensagens mudam
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	if (!messages || messages.length === 0) {
		return <div ref={containerRef} className="h-100 text-black p-3 overflow-auto text-white">
			<p className="text-center">Nenhuma mensagem ainda. Comece uma conversa!</p>
		</div>;
	}

	const getDateFormating = (date: string) => {
		const data = new Date(date.replace(/\.\d{3,6}/, '.000'));
		const horas = String(data.getHours()).padStart(2, "0");
		const minutos = String(data.getMinutes()).padStart(2, "0");
		return `${horas}:${minutos}`;
	}

	const cssPhoto: React.CSSProperties = {
		height: '40px',
		width: '40px',
		borderRadius: '50%',
		cursor: 'pointer',
	}
	return (
		<div ref={containerRef} className="h-100 text-black p-3 overflow-auto">
			{
				messages.map((message: MessageDto) => {
					const dateFormating = getDateFormating(message.date)
					return message.sender.id === user.id
						? (
							<div className='d-flex mb-2 justify-content-end' key={message.id}>
								<div className='bg-light rounded me-2 p-2 d-flex' style={{ maxWidth: '65%' }}>
									<div className="message">
										<p style={{ fontWeight: '600' }}>{message.content}</p>
									</div>
									<p
										className="ms-2 d-flex align-items-end message-data">{dateFormating}
									</p>
								</div>
								<img style={cssPhoto} src={message.sender.avatar} alt={`Foto do usuario ${message.sender.nickname}`}
								// onClick={() => props.showDinamicProfile(props.sender.nickname, props.sender)}
								/>
							</div>
						)
						: (
							<div className='d-flex mb-2' key={message.id}>
								<img style={cssPhoto} src={message.sender.avatar} alt={`foto do usuario ${message.sender.avatar}`} />

								<div className='bg-light rounded ms-2 p-2 d-flex' style={{ maxWidth: '65%' }}>
									<div className="message">
										<p style={{ fontWeight: '600' }}>{message.content}</p>
									</div>
									<p className="ms-2 d-flex align-items-end message-data">
										{dateFormating}
									</p>
								</div>
							</div>
						)
				})
			}
		</div>
	)
}
