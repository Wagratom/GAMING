import React from "react";

type propsButtonsMain = {
	Photo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	position: string;
};

export default function ButtonsMain(props: propsButtonsMain): JSX.Element {
	const { Photo, position } = props;
	const [isHover, setIsHover] = React.useState(false);

	const CSSButton: React.CSSProperties = {
		cursor: "pointer",
		transition: "0.3s",
		transform: isHover ? 'scale(1.2)' : 'scale(1)'
	};
	return (
		<Photo className={`h-25 position-absolute ${position} p-2`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			style={CSSButton}
		/>
	);
}
