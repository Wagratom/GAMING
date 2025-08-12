import PhotoLeftSide from "./PhotoLeftSide"
import PhotoRightSide from "./PhotoRightSide"

type propsBarDataUsers = {
	nicknameLeft: string,
	nicknameRight: string,
	gameWight: number,
}
export default function BarDataUsers(props: propsBarDataUsers): JSX.Element {
	const divNicknamePlayers: React.CSSProperties = {
		width: props.gameWight,
	}

	return (
		<div className="d-flex text-white align-items-center pb-3" style={divNicknamePlayers}>
			<PhotoLeftSide nickname={props.nicknameLeft} />
			<div>
				<p className="fs-3">VS</p>
			</div>
			<PhotoRightSide nickname={props.nicknameLeft} />
		</div>
	)
}
