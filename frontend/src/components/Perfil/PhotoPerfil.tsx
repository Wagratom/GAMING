import { useRef } from 'react';
import luffyFugindo from '../../assets/perfil/presencial.gif';
import luffyIndo from '../../assets/perfil/remoto.gif';
import ButtonPerfil from './ButtonPerfil';

export default function PhotoPerfil() {
	let gifLuffy = useRef<HTMLImageElement>(null);

	const setLuffyFugindo = () => {
		if (gifLuffy.current) gifLuffy.current.src = luffyFugindo;
	};

	const setLuffyIndo = () => {
		if (gifLuffy.current) gifLuffy.current.src = luffyIndo;
	};

	return (
		<div className="photo-perfil-container">
			<div className="photo-buttons">
				<ButtonPerfil content="Remoto" type="button" function={setLuffyIndo} />
				<ButtonPerfil content="Presencial" type="button" function={setLuffyFugindo} />
			</div>

			<div className="photo-wrapper">
				<img className="photo-gif" src={luffyIndo} alt="Luffy" ref={gifLuffy} />
				<div className="photo-background"></div>
			</div>
		</div>
	);
}
