import background from '../../../../assets/rankLevel/banner.png'

type propsImageProfile = {
	borderImg: string;
	avatar: string;
	nickname: string;
}

export default function ProfilePhoto(props: propsImageProfile): JSX.Element {
	function returnFunction() {
		if (props.avatar) {
			return (
				<div className='h-profile' style={{
					backgroundImage: `url(${background})`,
					backgroundSize: "100% 100%",
					width: '230px'
				}}>
					<div className={`cssDefaultRanks ${props.borderImg}`}>
						<img src={props.avatar} alt='foto' />
					</div>
					<p className='letter-pixel fs-1'>{props.nickname}</p>
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
