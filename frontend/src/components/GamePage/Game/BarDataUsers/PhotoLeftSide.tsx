export default function PhotoLeftSide({nickname}: {nickname: string}): JSX.Element {
	const cssDivPhoto: React.CSSProperties = {
		height: 'calc(100vh* 0.05)',
		width: 'calc(100vh* 0.05)',
	}
	return (
		<div className="d-flex w-50 justify-content-center align-items-center">
			<img style={cssDivPhoto} className="rounded-circle" src="https://tm.ibxk.com.br/2015/09/09/09165955100389.jpg?ims=1200x675" alt="" />
			<p className="fs-5 ms-5">{nickname}</p>
		</div>
	)
}
