import React, { useContext } from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { UserData } from '../../InitialPage/Contexts/Contexts';
import { VscEye } from "react-icons/vsc";
import { TbEyeClosed } from "react-icons/tb";

import { GoMute } from "react-icons/go";
import { Players } from "../../InitialPage/Contexts/Contexts";

type PropsStatus = {
	name: string,
	my_id: string,
	admin: Players[],
	mute: { id: string }[]
	online: boolean,
	match_status: string
	player_id: string
}

export default function PlayerNicknameAndIcons(props: PropsStatus): JSX.Element {
	const userData = useContext(UserData).user;

	const handleWatchPath = (e: React.MouseEvent<SVGElement, MouseEvent>): void => {
		e.stopPropagation();
		let obj = {
			playerId: props.my_id,
			watcherId: props.player_id
		}
		userData.socket?.emit('watch-match', obj);
	}

	const getIcons = (): JSX.Element => {

		const cssSecond: React.CSSProperties = {
			marginLeft: '2px',
			marginBottom: '2px'
		}

		const cssIcons: React.CSSProperties = {
			marginLeft: '6px',
			marginBottom: '2px'
		}

		const cssWatch: React.CSSProperties = {
			...cssIcons,
			zIndex: '1',
		}
		return (
			<>
				{/* verify if the player muted*/}
				{props.mute.find((item) => item.id === props.player_id) && (
					<GoMute key={props.player_id + '1'} style={cssIcons} />
				)}

				{/* verify if the player is admin */}
				{props.admin.find((item) => item.id === props.player_id) && (
					<MdOutlineAdminPanelSettings key={props.player_id} style={cssSecond} />
				)}
				
				{/* // verify if the player is watching a game */}
				{props.match_status === "WATCHING" && (
					<TbEyeClosed style={cssWatch} title="watching a game" />
				)}


				{/* //verify if the player is playing a game */}
				{props.match_status === "PLAYING" && (
					<VscEye style={cssWatch} onClick={handleWatchPath} title="Watch game" />
				)}
			</>
		)
	}

	return (
		<div className="p-1">
			<div className="d-flex align-items-end position-relative z-2 justify-content-end">
				<p>{props.name}</p>
				{getIcons()}
			</div>

		</div>
	);
}
