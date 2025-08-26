import { MdModeEdit } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdExit } from 'react-icons/io';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

type propsSelectConfiuration = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
	id: string;
	setShowConfigurations: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OptionsMiniProfile(props: propsSelectConfiuration): JSX.Element {
	const navitaion = useNavigate();

	const cursoPointer: React.CSSProperties = {
		cursor: 'pointer',
	}

	const disconnect = () => {
		Cookies.remove('jwtToken');
		navitaion('/');
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
