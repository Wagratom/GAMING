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

// onClick={() => props.showDinamicProfile(props.nickname, props.id)}

export default function MessagePeople({ notificacao, date, _key }: { notificacao: MessageDto, date: string, _key: string  }): JSX.Element {
	return (
		<div className='d-flex mb-2' key={_key}>
			<img style={cssPhoto} src={notificacao.sender.avatar} alt={`foto do usuario ${notificacao.sender.avatar}`} />

			<div className='bg-light rounded ms-2 p-2 d-flex' style={{ maxWidth: '65%' }}>
				<div style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere', hyphens: 'auto' }}>
					<p style={{ fontWeight: '600' }}>{notificacao.content}</p>
				</div>
				<p className="ms-2 d-flex align-items-end" style={{ fontSize: '10px', color: 'gray' }}>
					{date}
				</p>
			</div>
		</div>
	)
}
