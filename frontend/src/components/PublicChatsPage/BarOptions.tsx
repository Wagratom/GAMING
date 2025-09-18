import React, { useEffect, useRef, useState } from 'react';
import { BiMessageAltAdd, BiSearchAlt } from 'react-icons/bi';
import { CiLock } from "react-icons/ci";
import { chatDto } from '../InitialPage/Contexts/Contexts';

type BarOptionsProps = {
	setShowCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
	chatList: any[];
	setChatList: React.Dispatch<React.SetStateAction<chatDto[]>>
};

export default function BarOptions({ chatList, setChatList, setShowCreateChat }: BarOptionsProps) {
	const [allchats, setAllChats] = useState(chatList);

	function handleSearchChatsByName(event: React.ChangeEvent<HTMLInputElement>) {
		const searchTerm = event.target.value.toLowerCase();

		if (searchTerm === '') {
			setChatList(allchats);
		} else {
			const filteredChats = allchats.filter(chat =>
				chat.name.toLowerCase().includes(searchTerm)
			);
			setChatList(filteredChats);
		}
	}

	const [index, setIndex] = useState(0);
	const chatsType = useRef<string[]>(["Todos os Grupos", "Chats Públicos", "Grupos Privados"]);

	// apenas atualiza a lista quando o index mudar
	useEffect(() => {
		const typeName = chatsType.current[index];

		if (typeName === "Todos os Grupos") {
			setChatList(allchats);
		} else {
			const type = typeName === "Chats Públicos" ? "PUBLIC" : "PROTECT";
			const filteredChats = allchats.filter(chat => chat.type === type);
			setChatList(filteredChats);
		}
	}, [index, allchats, setChatList]);

	function handleSearchChatsByType() {
		setIndex(prev => (prev + 1) % chatsType.current.length);
	}

	return (
		<div className='d-flex w-100' id='BarChats'>
			{/* barra de pesquisa */}
			<div className='d-flex align-items-center w-50 inputFindChat color-aaa'>
				<BiSearchAlt size={28} style={{ marginRight: '8px'}} />
				<input
					type='text'
					placeholder='Procurar grupo...'
					id='inputFindChat'
					onChange={handleSearchChatsByName}
				/>
			</div>

			{/* botão criar grupo */}
			<button
				className='d-flex align-items-center ms-auto'
				onClick={() => setShowCreateChat(true)}
			>
				<BiMessageAltAdd className='color-aaa' size={26} style={{ marginRight: '6px' }} />
				<p className='color-aaa'>Criar Grupo</p>
			</button>

			{/* toggle público/privado */}
			<button
				className='d-flex shadow-grounps align-items-center'
				onClick={() => {
					handleSearchChatsByType();
					// props.getListPrivateChats()
				}}
			>
				<CiLock className='color-aaa' size={30} />
				<p className='mx-2 fw-bold color-aaa'>{chatsType.current[index]}</p>
			</button>
		</div>
	)
}

