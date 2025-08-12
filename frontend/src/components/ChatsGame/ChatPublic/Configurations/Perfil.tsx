import React from 'react';
import { BsFillPencilFill } from 'react-icons/bs';

type propsPerfil = {
	chatName: string;
	chatPhoto: string;
	numberMembers: number;
}

export default function Perfil(props: propsPerfil) : JSX.Element {
	const [showEditName, setShowEditName] = React.useState(false);

	return (
		<div className="p-3 border-bottom">
			<img
				src="https://i.etsystatic.com/37688069/r/il/d3e600/5143421340/il_600x600.5143421340_sm1f.jpg"
				alt="Foto do grupo em configuraçoes"
				className="foto-list-friends"
				style={{ width: '10rem', height: '10rem' }}
			/>
			<h3>
				{props.chatName}
				<BsFillPencilFill size={20} style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={() => setShowEditName(!showEditName)}/>
			</h3>
			{showEditName === true ? <input type="text" className="remove-format-input text-center border-bottom mb-1" placeholder="Novo nome do grupo" /> : null}
			<h4>Grupo - {props.numberMembers} participantes</h4>
		</div>
	)
}
