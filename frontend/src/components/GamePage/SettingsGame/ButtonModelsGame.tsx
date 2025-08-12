import { useContext, useState } from "react"
import { UserData } from "../../InitialPage/Contexts/Contexts"

type propsButtonPlay = {
	photo: string,
	model: string,
	isRanking?: boolean,
}

export default function ButtonModelsGame(props: propsButtonPlay): JSX.Element {
	const [isHover, setIsHover] = useState(false)
	const userData = useContext(UserData).user

	const cssDiv: React.CSSProperties = {
		height: '8rem',
		width: '8rem',
		margin: '1rem',
		backgroundColor: '#666',
		padding: '0.5rem',
		borderRadius: '0.5rem',
		transition: 'all 0.5s',
		transform: isHover ? 'scale(1.1)' : 'scale(1)',
	}

	const cssPhoto: React.CSSProperties = {
		height: '80%',
		width: '100%',
		marginBottom: '0.5rem',
		borderRadius: '0.5rem',
	}

	const cssButton: React.CSSProperties = {
		width: '100%',
		height: '40%',
		border: 'none',
		borderRadius: '0.5rem',
		backgroundColor: '#ffbf00',
	}

	function handleClick() {
		//TODO: REMOVER ESSA CAMBIARRA DEPOIS
		if (userData.nickname === 'bla')
			userData.id = '1234'

		const objectQueue = {
			id: userData.id,
			isRanking: props.isRanking ? true : false,
		}
		userData.socket?.emit('joinRoom', objectQueue)
	}

	return (
		<>
			<div style={cssDiv}
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
				onClick={handleClick}
			>
				<div style={cssPhoto}>
					<img className='h-100 w-100 rounded' src={props.photo} alt="playPong" />
				</div>
				<button type="button" style={cssButton}>
					{props.model}
				</button>
			</div>
		</>
	)

}
