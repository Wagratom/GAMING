import PersonalInformation from './PersonalInformation';
import PhotoPerfil from './PhotoPerfil';
import background from '../../assets/perfil/bg.png'
import FolderPerfil from './Footer';


export default function Perfil() {

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
		<div style={cssPerfil} onClick={(event) => event.stopPropagation()}>
			<div style={cssDivAux}>
				<PhotoPerfil />
				<PersonalInformation />
				<FolderPerfil />
			</div>
		</div>
	);
}
