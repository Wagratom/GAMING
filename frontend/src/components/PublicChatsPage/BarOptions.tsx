import { BiSearchAlt, BiMessageAltAdd } from 'react-icons/bi';
import { CiUnlock, CiLock } from "react-icons/ci";
import React, { ReactElement, useState } from 'react';

type BarOptionsProps = {
	handleSearchChats: (event: React.ChangeEvent<HTMLInputElement>) => void;
	setShowCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
	getListPublicChats: () => void;
	getListPrivateChats: () => void;
};

export default function BarOptions(props: BarOptionsProps) {
	const [showTypeChat, setShowTypeChat] = useState('private');

	const buttonPrivateChat = (): ReactElement => {
		return (
			<button
				className='d-flex shadow-grounps align-items-center'
				onClick={() => {
					setShowTypeChat('public');
					props.getListPrivateChats()
				}}
			>
				<CiLock size={30} />
				<p className='mx-2 fw-bold'>Chats Privados</p>
			</button>
		)
	}

	const buttonPublicChat = (): ReactElement => {
		return (
			<button
				className='d-flex shadow-grounps align-items-center'
				onClick={() => {
					setShowTypeChat('private');
					props.getListPublicChats()
				}}
			>
				<CiUnlock size={30} />
				<p className='mx-2 fw-bold'>Chats Publicos</p>
			</button>
		)
	}
	return (
		<div className='d-flex shadow-grounps rounded p-2' id='BarChats'>
			<div className='d-flex align-items-center shadow-grounps w-25'>
				<BiSearchAlt size={30} style={{ padding: '5px', color: '#0e0036', transform: 'scaleX(-1)' }} />
				<input
					onChange={props.handleSearchChats}
					type='text'
					placeholder='Procurar grupo'
					id='inputFindChat'
				/>
			</div>
			<button className='d-flex shadow-grounps ms-auto me-5 align-items-center' onClick={() => props.setShowCreateChat(true)}>
				<BiMessageAltAdd size={30} color='black' />
				<p className='mx-2 fw-bold'>Criar Grupo</p>
			</button>
			{showTypeChat === 'private' ? buttonPrivateChat() : buttonPublicChat()}
		</div>
	)
}

