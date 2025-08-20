import { UserData } from '../../InitialPage/Contexts/Contexts';
import MatchHistory from './MatchHistory';
import Perfil from './Perfil/Perfil';
import { useContext } from 'react';
import './rank.css'

export default function ProfileScreen() {
	const dataUser = useContext(UserData).user;
	return (
		<div className="row g-0 p-2 bg-custon-roxo rounded h-100">
			<div className='col-md-3 col-lg-2'>
				<Perfil />
			</div>
			<div className='col-md-9 col-lg-10 text-white d-flex flex-column h-100 p-5'>
				<div className='faixa-amarela p-2'>
					<h2 className='fst-italic ms-5 p-2'>PARTIDAS</h2>
				</div>
				<div className='overflow-y-auto' id='MatchHistory'>
					<MatchHistory userId={dataUser.id} />
					<MatchHistory userId={dataUser.id} />
					<MatchHistory userId={dataUser.id} />
					<MatchHistory userId={dataUser.id} />
				</div>
			</div>
		</div>
	);
}
