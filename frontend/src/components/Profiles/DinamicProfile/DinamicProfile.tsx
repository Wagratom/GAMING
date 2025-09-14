import { useContext, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import BannerProfile from "../ProfilePage/BannerProfile";
import MatchHistory from "../ProfilePage/MatchHistory";
import '../ProfilePage/rank.css';
import HandleRank from "../RankMapings";
import axios from "axios";

type propsDinamicProfile = {
	nickName: string;
	id: string;
	openDinamicProfile: React.Dispatch<React.SetStateAction<string>>;
}

export default function DinamicProfile(props: propsDinamicProfile): JSX.Element {
	const cssBackgroundTerra = {
		backgroundImage: "url(https://64.media.tumblr.com/aa7de5c2a2d6edf560a38a38f89ea47f/tumblr_pea4idNiRJ1ww81r3o1_540.gif)",
		backgroundSize: 'cover',
		backgroundPosition: 'contain',
		backgroundRepeat: 'no-repeat',
		zIndex: 1000
	}

	function fetchGetProfile() {
		const url = `${process.env.REACT_APP_API_URL}/users/profile/${props.id}`;
		axios.get(url, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
			withCredentials: true
		})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		fetchGetProfile();
	}, [props.id]);

	const { rank, borderImg } = HandleRank(40);
	return (
		<div className="text-white h-75 w-75 position-fixed top-50 start-50 translate-middle" style={cssBackgroundTerra}>
			<IoMdClose className="button-close" onClick={() => props.openDinamicProfile('')} />
			<BannerProfile rank={rank} borderImg={borderImg}/>
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
