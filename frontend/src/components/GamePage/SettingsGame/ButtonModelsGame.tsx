type PropsButtonPlay = {
	photo: string,
	mode: string,
	handleClick: (mode: string) => void
}

export default function ButtonModelsGame({ photo, mode, handleClick }: PropsButtonPlay): JSX.Element {
	return (
		<div
			className="button-models-game"
			onClick={() => handleClick(mode)}
		>
			<div className="button-models-game-photo">
				<img className="h-100 w-100 rounded" src={photo} alt="playPong" />
			</div>
			<button type="button" className="button-models-game-btn">
				{mode}
			</button>
		</div>
	)
}
