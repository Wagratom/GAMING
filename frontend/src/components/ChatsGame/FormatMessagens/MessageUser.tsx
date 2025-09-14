import { MessageDto } from "../../InitialPage/Contexts/Contexts"

export default function MessageUser({ notificacao, date, _key }: { notificacao: MessageDto, date: string, _key: string }): JSX.Element {
	const cssPhoto: React.CSSProperties = {
		height: '40px',
		width: '40px',
		borderRadius: '50%',
		cursor: 'pointer',
	}

	return (
		<div className='d-flex mb-2 justify-content-end' key={_key}>
			<div className='bg-light rounded me-2 p-2 d-flex' style={{ maxWidth: '65%' }}>
				<div style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere', hyphens: 'auto' }}>
					<p style={{ fontWeight: '600' }}>{notificacao.content}</p>
				</div>
				<p className="ms-2 d-flex align-items-end" style={{ fontSize: '10px', color: 'gray' }}>{date}</p>
			</div>
			<img style={cssPhoto} src={notificacao.sender.avatar} alt={`Foto do usuario ${notificacao.sender.nickname}`}
			// onClick={() => props.showDinamicProfile(props.sender.nickname, props.sender)}
			/>
		</div>
	)
}
