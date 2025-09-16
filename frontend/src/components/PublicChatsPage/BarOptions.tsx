import { BiSearchAlt, BiMessageAltAdd } from 'react-icons/bi';
import { CiUnlock, CiLock } from "react-icons/ci";
import React, { ReactElement, useState } from 'react';

type BarOptionsProps = {
	setShowCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BarOptions(props: BarOptionsProps) {
	const [showTypeChat, setShowTypeChat] = useState('private');

	const buttonPrivateChat = (): ReactElement => {
		return (
			<button
				className='d-flex shadow-grounps align-items-center'
				onClick={() => {
					setShowTypeChat('public');
					// props.getListPrivateChats()
				}}
			>
				<CiLock size={30} />
				<p className='mx-2 fw-bold'>Grupos Privados</p>
			</button>
		)
	}

	const buttonPublicChat = (): ReactElement => {
		return (
			<button
				className='d-flex shadow-grounps align-items-center'
				onClick={() => {
					setShowTypeChat('private');
					// props.getListPublicChats()
				}}
			>
				<CiUnlock size={30} />
				<p className='mx-2 fw-bold'>Grupos Publicos</p>
			</button>
		)
	}
	return (
		<div className='d-flex w-100' id='BarChats'>
			{/* barra de pesquisa */}
			<div className='d-flex align-items-center w-50 inputFindChat'>
				<BiSearchAlt size={28} style={{ marginRight: '8px', color: '#aaa' }} />
				<input
					type='text'
					placeholder='Procurar grupo...'
					id='inputFindChat'
				// onChange={props.handleSearchChats}
				/>
			</div>

			{/* botão criar grupo */}
			<button
				className='d-flex align-items-center ms-auto'
				onClick={() => props.setShowCreateChat(true)}
			>
				<BiMessageAltAdd size={26} style={{ marginRight: '6px' }} />
				<p>Criar Grupo</p>
			</button>

			{/* toggle público/privado */}
			{showTypeChat === 'private' ? buttonPrivateChat() : buttonPublicChat()}
		</div>

	)
}

