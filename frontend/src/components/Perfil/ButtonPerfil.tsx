import backgroundButton from '../../assets/perfil/bgButtonConfigurations.png';

type propsButtonConfigurations = {
	content: string;
	function?: () => void;
	type: "button" | "submit" | "reset";
}

export default function ButtonPerfil(props: propsButtonConfigurations): JSX.Element {
	const cssButton: React.CSSProperties = {
		border: "none",

		backgroundImage: `url(${backgroundButton})`,
		backgroundSize: "100% 100%",
		backgroundColor: "transparent",

		display: "flex",
		justifyContent: "center",
		alignItems: "center",


		color: "white",
		width: "17rem",
		height: "2.5rem",
		padding: "0.6rem 0.5rem 0.5rem 0.5rem",
		gap: "0.5rem",
		cursor: "pointer",
	}

	const cssParagraph: React.CSSProperties = {
		fontSize: "1.5rem",
	}

	return (
		<button
			style={cssButton}
			onClick={() => props.function ? props.function() : null}
			type={props.type}
		>
			<p style={cssParagraph}>{props.content}</p>
		</button>
	)
}
