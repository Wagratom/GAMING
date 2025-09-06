import { useContext } from "react"
import { UserData } from "../../InitialPage/Contexts/Contexts"

type propsButtonPlay = {
	photo: string,
	model: string,
	isRanking?: boolean,
}

export default function ButtonModelsGame(props: propsButtonPlay): JSX.Element {
	function handleClick() {
	}

	return (
		<div
			className="button-models-game"
			onClick={handleClick}
		>
			<div className="button-models-game-photo">
				<img className="h-100 w-100 rounded" src={props.photo} alt="playPong" />
			</div>
			<button type="button" className="button-models-game-btn">
				{props.model}
			</button>
		</div>
	)
}
