export default function PhotoRightSide({ nickname }: { nickname: string }): JSX.Element {
	const cssDivPhoto: React.CSSProperties = {
		height: 'calc(100vh* 0.05)',
		width: 'calc(100vh* 0.05)',
	}

	return (
		<div className="d-flex w-50 justify-content-center align-items-center">
			<p className="fs-5 me-5">{nickname}</p>
			<img style={cssDivPhoto} className="rounded-circle" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS9MzcVvUQ8nVadn6PKySCPwj0HAP-aVA-jw&usqp=CAU" alt="" />
		</div>
	)
}
