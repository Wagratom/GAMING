type propsPointer = {
	wins: number,
	loses: number,
	draws: number,
	kda: number,
	borderWrite: string,
	pointers: number
}

export default function Pointer(props: propsPointer): JSX.Element {
	return (
		<div className={props.borderWrite}>
			<p className='fw-bold me-2 fs-3'>VT<br></br>{props.wins}</p>
			<p className='fw-bold me-2 fs-3'>DR<br></br>{props.loses}</p>
			<p className='fw-bold me-2 fs-3'>EPT<br></br>{props.draws}</p>
			<p className='fw-bold fs-3'>KDA<br></br>{props.kda}</p >
		</div>
	)
}
