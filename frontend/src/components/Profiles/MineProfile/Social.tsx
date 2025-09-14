import { IoLogoGameControllerA } from "react-icons/io";
import { MdOutlinePersonOutline } from "react-icons/md";

type Props = {
	setResourcePlayer: React.Dispatch<React.SetStateAction<string>>;
}

function Social({ setResourcePlayer }: Props) {
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
					size={30}
					onClick={() => setResourcePlayer("/friends?status=ACCEPTED")}
				/>
				{/* visualizar todos os usuarios */}
				<IoLogoGameControllerA
					style={styleButton}
					title="All Players"
					size={30}
					onClick={() => setResourcePlayer("/users")}
				/>
			</div>
		</div>
	)
}

export default Social
