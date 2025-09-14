import { useLocation } from "react-router-dom";

import { useEffect, useRef } from "react";
import { UserDto } from "../../InitialPage/Contexts/Contexts";
import BarDataUsers from "./BarDataUsers";
import TableGame from "./TableGame";


type LocationState = {
	playerLeft: UserDto;
	playerRight: UserDto;
};

export default function GameWW(): JSX.Element {
	const location = useLocation();

	const cssPage: React.CSSProperties = {
		height: '100vh',
		width: '100vw',
		overflow: 'hidden',
		backgroundImage: `url(https://wallpaperaccess.com/full/2513478.jpg)`,
		backgroundSize: 'cover',
	};


	const { playerLeft, playerRight } = (location.state as LocationState) || {};
	return (
		<div style={cssPage} tabIndex={0} >
			<div className="d-flex flex-column justify-content-center align-items-center h-75 container">
				<BarDataUsers
					userLeft={playerLeft}
					userRight={playerRight}
				/>
				<TableGame />
			</div>
		</div>
	);
}
