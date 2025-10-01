import { MdModeEdit } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdExit } from 'react-icons/io';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type propsSelectConfiuration = {
	showMiniPerfil: (name: string) => void;
	id: string;
	setShowConfigurations: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OptionsMiniProfile(props: propsSelectConfiuration): JSX.Element {
	const navigate = useNavigate();

	const cursoPointer: React.CSSProperties = {
		cursor: 'pointer',
	}

	const disconnect = () => {
		const route = `${process.env.REACT_APP_API_URL}/logout`;

		axios.patch(route, {}, { // corpo vazio {}
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			withCredentials: true,
		})
			.then((res) => {
				if (res.status === 200) {
					Cookies.remove("jwtToken");
					navigate("/login");
				}
			})
			.catch((err) => {
				console.error("Erro ao desconectar:", err);
			});
	}

	return (
		<div className='bg-light text-black rounded z-2' style={{ paddingRight: '25px' }}>
			<div className='border-bottom'
				style={cursoPointer}
				onClick={() => props.setShowConfigurations(true)}
			>
				<p><MdModeEdit className='m-1' />Editar Profile</p>
			</div>
			<div className='border-bottom'
				style={cursoPointer}
				onClick={() => disconnect()}
			>
				<p><IoMdExit className='m-1' />Lougot</p>
			</div>
			<div
				style={cursoPointer}
				onClick={() => props.showMiniPerfil('')}
			>
				<p><AiOutlineClose className='m-1' />Close</p>
			</div>
		</div>
	)
}
