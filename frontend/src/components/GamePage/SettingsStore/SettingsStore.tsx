import React, { SetStateAction, useState } from "react";
import ShowItemsStore from "./ShowItemsStore";
import FakeApiStore from "./FakeApiStore";
import bgLua from "../../../assets/game/planets/backgrounds/bgLua.jpg";
import bgLua2 from "../../../assets/game/planets/backgrounds/bgLua2.jpg";
import ButtonClosed from "../Game/ButtonClosed";

type propsSettingsStore = {
	openSettingsStore: React.Dispatch<SetStateAction<string>>;
}

export default function SettingsStore(props: propsSettingsStore): JSX.Element {
	const [barPerfil, setBarPerfil] = useState(true)

	const ButtonSelected: React.CSSProperties = {
		marginLeft: '1.5rem',
		padding: '1rem',
		color: 'white',
		fontSize: '1.5rem',
		fontWeight: 'bold',

		border: 'none',
		borderTopLeftRadius: '1rem',
		borderTopRightRadius: '1rem',

		boxShadow: '6px 4px 2px #0c1d3b inset, 2px 0px 2px #0c1d3b',
		backgroundImage: `url(${bgLua2})`,
		backgroundSize: 'cover',

	}

	const ButtonUnselected: React.CSSProperties = {
		...ButtonSelected,
		marginLeft: '1rem',
		marginBottom: '2px',
		borderBottomLeftRadius: '0.5rem',
		borderBottomRightRadius: '0.5rem',
	}

	const firtdivSelectGame: React.CSSProperties = {
		position: 'relative',
		padding: '1.3rem',
		borderRadius: '1.5rem',
		color: 'white',
		backgroundImage: `url(${bgLua})`,
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
		backgroundColor: '#0c1d3b',
		backgroundSize: 'cover',
	}

	return (
		<div className="position-absolute top-50 start-50 translate-middle">
			<div className="d-flex">
				<button onClick={() => setBarPerfil(true)}
					style={ButtonSelected}
				>
					Bar Perfil
				</button>
				<button onClick={() => setBarPerfil(false)}
					style={ButtonUnselected}
				>
					Bar Game
				</button>
				<ButtonClosed backgroundColor="#46668a"
					backgroundShadow="#0c1d3b"
					closed={props.openSettingsStore}
				/>
			</div>
			<div style={firtdivSelectGame}>
				{barPerfil ? <ShowItemsStore items={FakeApiStore('skinsBar')} /> :
					<ShowItemsStore items={FakeApiStore('skinsGame')} />
				}
				<div style={principaldivSelectGame}></div>
			</div>
		</div>
	)
}
