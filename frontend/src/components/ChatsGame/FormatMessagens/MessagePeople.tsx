import { MessageDto } from "../../InitialPage/Contexts/Contexts"

const cssDetails: React.CSSProperties = {
	fontSize: '11px',
}
const cssDetailsHidden: React.CSSProperties = {
	...cssDetails,
	visibility: 'hidden',
}

const cssPhoto: React.CSSProperties = {
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	cursor: 'pointer',
}

export default function MessagePeople({ notificacao, date }: { notificacao: MessageDto, date: string }): JSX.Element {
	return (
		<div className='d-flex mb-2'>
			<img
				style={cssPhoto}
				src={notificacao.sender.avatar}
				alt='foto'
			// onClick={() => props.showDinamicProfile(props.nickname, props.id)}
			/>
			<div className='bg-light rounded ms-2 p-2 d-flex' style={{ whiteSpace: 'pre-line' }}>
				<p style={{ fontWeight: '600' }}>{notificacao.content}</p>
				<p className="ms-2 d-flex align-items-end" style={{ fontSize: '10px', color: 'gray' }}>{date}</p>
			</div>
		</div>
	)
}
