import { UserDto } from "../../../InitialPage/Contexts/Contexts"

type BarDataUsersProps = {
	gameWight: number;
	userLeft: UserDto;
	userRight: UserDto;
}

export default function BarDataUsers({ gameWight, userLeft, userRight }: BarDataUsersProps): JSX.Element {
	const divNicknamePlayers: React.CSSProperties = {
		width: gameWight,
	}

	const cssDivPhoto: React.CSSProperties = {
		width: '60px',
		height: '60px',
		objectFit: 'cover',
	}
	return (
		<div 
			className="d-flex text-white align-items-center pb-3" style={divNicknamePlayers}>
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
					src={userLeft.avatar}
					alt={"Foto do usuário " + userRight.nickname}
				/>
			</div>
		</div>
	)
}
