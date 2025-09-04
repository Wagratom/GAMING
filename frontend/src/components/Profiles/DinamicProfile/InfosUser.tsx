import ProfilePhoto from "../ProfilePage/Perfil/Image";
import HandleRank from "../RankMapings";
import Pointer from "../ProfilePage/Perfil/pontos";
import { useContext } from "react";
import { UserData } from "../../InitialPage/Contexts/Contexts";

export default function InfosUser({ nickName }: { nickName: string }): JSX.Element {
	const { user } = useContext(UserData)
	// const [infosUser, setInfosUser] = useState<InfosUserPerfil>({} as InfosUserPerfil);

	// const getProfile = (): void => {
	// 	axios.get(`${process.env.REACT_APP_HOST_URL}/users/profile/?nick_name=${nickName}`, {
	// 		headers: {
	// 			Authorization: Cookies.get('jwtToken'),
	// 			"ngrok-skip-browser-warning": "69420",
	// 		}
	// 	})
	// 	.then((response) => {
	// 		setInfosUser(response.data);
	// 	}
	// 	).catch(() => {})
	// }

	// useEffect(() => {
	// 	getProfile();
	// }, []);

	const { rank, borderImg, borderWrite } = HandleRank(35);

	return (
		<div className="h-100 position-absolute d-flex justify-content-center">
			<ProfilePhoto
				borderImg={borderImg}
				avatar={user.avatar}
				nickname={user.nickname}
			/>
			{/* <div className='h-100'>
				<img className='img-fluid h-100' src={rank} alt={`Foto do rank da pessoa`} />
			</div>
			<Pointer wins={10}
				loses={5}
				draws={3}
				kda={0.3}
				borderWrite={borderWrite}
			/> */}
		</div>
	)
}
