import { IoLogoGameControllerA } from "react-icons/io";
import { MdOutlinePersonOutline } from "react-icons/md";

const URLS_MiniPerfilPlayers = {
	'personal': `${process.env.REACT_APP_HOST_URL}/users/friends`,
	'Global': `${process.env.REACT_APP_HOST_URL}/users/find-all`,
}

function Options({ getPlayers }: { getPlayers: (route: string) => void }) {

	function returnInput(func: (event: React.KeyboardEvent<HTMLInputElement>) => void) {
		return (
			<div className='rounded'>
				<input
					type='text'
					className='remove-format-input'
					placeholder='Search Friend'
					onKeyDown={func}
				/>
			</div>
		)
	}

	const styleButton: React.CSSProperties = {
		margin: '5px',
		cursor: 'pointer',
	}
	return (
		<div className='d-flex align-items-center px-2' style={{ color: "#808287" }}>
			<p className='fw-bold'>Social</p>
			<div className='d-flex justify-content-end w-100 options'>
				{/* visualizar os amigos */}
				<MdOutlinePersonOutline
					title="Friends"
					style={styleButton}
					size={30} onClick={() => getPlayers(URLS_MiniPerfilPlayers.personal)}
				/>
				{/* visualizar todos os usuarios */}
				<IoLogoGameControllerA
					style={styleButton}
					title="All Players"
					size={30} onClick={() => getPlayers(URLS_MiniPerfilPlayers.Global)}
				/>
			</div>
		</div>
	)
}

export default Options
