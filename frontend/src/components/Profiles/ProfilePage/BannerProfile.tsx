import { useContext } from "react";
import HandleRank from "../RankMapings";
import { UserData } from "../../InitialPage/Contexts/Contexts";

type propsBannerProfile = {
	rank: string;
	borderImg: string;
}

export default function BannerProfile({ rank, borderImg }: propsBannerProfile) {
	const { user } = useContext(UserData);

	if (user.avatar) {
		return (
			<div className='banner-profile'>
				<div className={`cssDefaultRanks ${borderImg}`}>
					<img src={user.avatar} alt='foto' />
				</div>
				<p className='letter-pixel fs-1'>{user.nickname}</p>
				<div style={{ marginTop: "auto", paddingBottom: "160px" }}>
					<img className='img-fluid h-100' src={rank} alt={`Foto do rank da pessoa`} />
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
