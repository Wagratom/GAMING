type propsBannerProfile = {
	rank: string;
	borderImg: string;
	avatar: string;
	nickname: string;
}

export default function BannerProfile({ rank, borderImg, avatar, nickname }: propsBannerProfile) {

	if (avatar) {
		return (
			<div className='banner-profile'>
				<div className={`cssDefaultRanks ${borderImg}`}>
					<img src={avatar} alt='foto' />
				</div>
				<p className='letter-pixel fs-1'>{nickname}</p>
				<div style={{ marginTop: "auto", paddingBottom: "160px" }}>
					<img className='img-fluid h-100' src={rank} alt={`Foto do rank da pessoa`} />
				</div>
			</div>
		)
	}
	return (
		<div className='banner-profile'>
			<div className="h-25 d-flex align-items-center justify-content-center">
				<div className="spinner-border text-danger h-100" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		</div>
	)
}
