
type propsImageProfile = {
	borderImg: string;
	avatar: string;
	nickname: string;
	rank: string;
}

export default function ProfilePhoto(props: propsImageProfile): JSX.Element {
	function returnFunction() {
		if (props.avatar) {
			return (
				<div className='banner-profile'>
					<div className={`cssDefaultRanks ${props.borderImg}`}>
						<img src={props.avatar} alt='foto' />
					</div>
					<p className='letter-pixel fs-1'>{props.nickname}</p>
					<div style={{ marginTop: "auto", paddingBottom: "160px" }}>
						<img className='img-fluid h-100' src={props.rank} alt={`Foto do rank da pessoa`} />
					</div>
				</div>
			)
		}
		return (
			<div className="h-100 d-flex align-items-center justify-content-center">
				<div className="spinner-border text-danger h-100" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		)
	}
	return returnFunction()
}
