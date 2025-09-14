import { UserDto } from "../../InitialPage/Contexts/Contexts";

type BarDataUsersProps = {
	userLeft: UserDto;
	userRight: UserDto;
};

export default function BarDataUsers({ userLeft, userRight }: BarDataUsersProps) {
	if (!userLeft || !userLeft.avatar || !userRight || !userRight.avatar) return null;

	const cssDivPhoto: React.CSSProperties = {
		width: "40px",
		height: "40px",
		objectFit: "cover",
	};


	return (
		<div className="d-flex text-white align-items-center mb-4" style={{ width: '600px' }}>
			<div className="d-flex w-50 justify-content-center align-items-center">
				<img
					style={cssDivPhoto}
					className="rounded-circle"
					src={userLeft.avatar}
					alt={"Foto do usuário " + userLeft.nickname}
				/>
				<p className="fs-5 ms-5">{userLeft.nickname}</p>
			</div>

			<div>
				<p className="fs-3">VS</p>
			</div>

			<div className="d-flex w-50 justify-content-center align-items-center">
				<p className="fs-5 me-5">{userRight.nickname}</p>
				<img
					style={cssDivPhoto}
					className="rounded-circle"
					src={userRight.avatar}
					alt={"Foto do usuário " + userRight.nickname}
				/>
			</div>
		</div>
	);
}
