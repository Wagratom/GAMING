import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { ProfileDto } from "../../InitialPage/Contexts/Contexts";
import BannerProfile from "../ProfilePage/BannerProfile";
import MatchHistory from "../ProfilePage/MatchHistory";
import '../ProfilePage/rank.css';
import HandleRank from "../RankMapings";

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

    const [profile, setProfile] = useState<ProfileDto | null>(null);

    function fetchGetProfile() {
        if (!props.id) return;

        const url = `${process.env.REACT_APP_API_URL}/users/profile/${props.id}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            withCredentials: true
        })
            .then((res) => { setProfile(res.data as ProfileDto) })
            .catch((err) => { });
    }

    useEffect(() => {
        fetchGetProfile();
    }, [props.id]);


    function getPoints() {
        if (!profile) return 0;
        const points = profile.matches.wins.length - profile.matches.losses.length;
        return points >= 0 ? points : 0;
    }
    // const winRate = totalGames > 0 ? (winners / totalGames) * 100 : 0;
    const { rank, borderImg } = HandleRank(getPoints());
    const allMatches = profile ? profile.matches.wins.concat(profile.matches.losses) : []
    return (
        <div className="text-white h-75 w-75 position-fixed top-50 start-50 translate-middle d-flex" style={cssBackgroundTerra}>
            <IoMdClose
                className="button-close"
                style={{
                    backgroundColor: '#2d3045',
                    boxShadow: `2px 2px 1px #FFF inset, -8px -8px 8px ${'#2b2e42'} inset`
                }}
                onClick={() => props.openDinamicProfile('')} />
            <BannerProfile rank={rank} borderImg={borderImg} />
            <div className="d-flex flex-column h-100 position-relative p-5 flex-grow-1">
                <div className='overflow-auto h-100 '>
                    <div className="p-3 rounded h-100" id="MatchHistory">
                        <MatchHistory userId={props.id} matchers={allMatches} />
                    </div>
                </div>
            </div>
        </div>
    )
}
