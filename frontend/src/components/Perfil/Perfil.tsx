import PersonalInformation from './PersonalInformation';
import PhotoPerfil from './PhotoPerfil';
import background from '../../assets/perfil/bg.png'
import FolderPerfil from './Footer';
import { IoMdClose } from 'react-icons/io';

type propsDinamicProfile = {
	close: (name: string) => void;
}

export default function Perfil({ close }: propsDinamicProfile) {

	const cssPerfil: React.CSSProperties = {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		width: '75%',
		height: '75%',


		backgroundImage: `url(${background})`,
		backgroundSize: '100% 100%',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',

	}

	const cssDivAux: React.CSSProperties = {
		position: 'relative',
		width: '100%',
		height: '100%',
		padding: '5rem',
	}

	return (
		<div style={cssPerfil}>
			<IoMdClose
				className="button-close"
				style={{
					backgroundColor: '#079fb5',
					boxShadow: 'rgb(255, 255, 255) 2px 2px 1px inset, #03505e -8px -8px 8px inset'
				}}
				onClick={() => close('')} />
			<div style={cssDivAux}>
				<PhotoPerfil />
				<PersonalInformation />
				<FolderPerfil />
			</div>
		</div>
	);
}
