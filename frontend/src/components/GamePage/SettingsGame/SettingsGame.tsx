import ModelsGame from "./ModelsGame";
import { IoMdClose as ButtonClosed } from "react-icons/io";
import bgFire from "../../../assets/game/planets/backgrounds/bgFire.jpg";
import bgFireCima from "../../../assets/game/planets/backgrounds/bgFireCima.jpg";
import bgFireCima2 from "../../../assets/game/planets/backgrounds/bgFireCima2.jpg";

type propsSettingsPath = {
	openSettingsPath: React.Dispatch<React.SetStateAction<string>>;
}

export default function SettingsPath(props: propsSettingsPath): JSX.Element {
	const cssButtonClosed: React.CSSProperties = {
		position: 'absolute',
		top: '0',
		right: '-0.6rem',
		zIndex: 3,

		height: '3rem',
		width: '3rem',
		borderRadius: '0.5rem',
		backgroundColor: '#e56e23',
		boxShadow: '2px 2px 1px #FFF inset, -8px -8px 8px #d81716 inset',

		cursor: 'pointer',
	}

	const ButtonSelected: React.CSSProperties = {
		marginLeft: '1.5rem',
		padding: '1rem',
		color: 'white',
		fontSize: '1.5rem',
		fontWeight: 'bold',

		border: 'none',
		borderTopLeftRadius: '1rem',
		borderTopRightRadius: '1rem',
		boxShadow: '6px 4px 2px #d81716 inset, 2px 0px 2px #d81716',
		backgroundImage: `url(${bgFireCima})`,
		backgroundSize: 'cover',

	}

	const ButtonUnselected: React.CSSProperties = {
		...ButtonSelected,
		marginLeft: '1rem',
		marginBottom: '2px',
		borderBottomLeftRadius: '0.5rem',
		borderBottomRightRadius: '0.5rem',
		backgroundImage: `url(${bgFireCima2})`,
	}

	const firtdivSelectGame: React.CSSProperties = {
		position: 'relative',
		padding: '1.3rem',
		borderRadius: '1.5rem',
		color: 'white',
		backgroundImage: `url(${bgFire})`,
		backgroundSize: 'cover',

	}

	const principaldivSelectGame: React.CSSProperties = {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 1,

		height: 'calc(100% + 0.5rem)',
		width: '100%',
		marginLeft: '0.5rem',
		borderRadius: '1.5rem',
		opacity: 0.7,
		backgroundColor: '#e56e23',
	}

	return (
		<div className="position-absolute top-50 start-50 translate-middle">
			<div className="d-flex">
				<button style={ButtonSelected}>Game</button>
				<button style={ButtonUnselected}>Custon</button>
				<ButtonClosed style={cssButtonClosed}
					onClick={() => props.openSettingsPath('')}
				/>
			</div>
			<div style={firtdivSelectGame}>
				<ModelsGame />
				<div style={principaldivSelectGame}></div>
			</div>
		</div>
	)
}
