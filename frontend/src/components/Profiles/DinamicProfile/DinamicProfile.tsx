import MatchHistory from "../ProfilePage/MatchHistory";
import '../ProfilePage/rank.css'
import ButtonClosed from "../../GamePage/Game/ButtonClosed";
import HandleRank from "../RankMapings";
import { useContext } from "react";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import BannerProfile from "../ProfilePage/BannerProfile";

type propsDinamicProfile = {
	nickName: string;
	id: string;
	openDinamicProfile: React.Dispatch<React.SetStateAction<string>>;
}

export default function DinamicProfile(props: propsDinamicProfile): JSX.Element {
	const { user } = useContext(UserData);

	const cssBackgroundTerra = {
		backgroundImage: "url(https://64.media.tumblr.com/aa7de5c2a2d6edf560a38a38f89ea47f/tumblr_pea4idNiRJ1ww81r3o1_540.gif)",
		backgroundSize: 'cover',
		backgroundPosition: 'contain',
		backgroundRepeat: 'no-repeat',
		zIndex: 1000
	}

	const { rank, borderImg, borderWrite } = HandleRank(15);


	return (
		<div className="text-white h-75 w-75 position-fixed top-50 start-50 translate-middle" style={cssBackgroundTerra}>
			<ButtonClosed backgroundColor="" backgroundShadow="" closed={props.openDinamicProfile} />
			<BannerProfile
				borderImg={borderImg}
				avatar={user.avatar}
				nickname={user.nickname}
				rank={rank}
			/>
			<div className="d-flex flex-column h-100 position-relative p-5">
				<div className='overflow-auto h-100 '>
					<div className="p-3 rounded h-100" id="MatchHistory">
						<MatchHistory userId={props.id} />
					</div>
				</div>
			</div>
		</div>
	)
}
