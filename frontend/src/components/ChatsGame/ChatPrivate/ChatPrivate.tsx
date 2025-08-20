import { useContext, useState } from 'react';
import { Messages } from '../ChatPublic/ChatPublic';
import FormatMessages from '../FormatMessagens/FormatMessagens';
import InputChats from '../InputChats';
import './ChatPrivate.css'
import { UserData } from '../../InitialPage/Contexts/Contexts';
import TitleChatPrivate from './Title';
import { Players } from '../../InitialPage/Contexts/Contexts'


export default function ChatPrivate({ player }: { player: Players }) {
	const [messages, setMessages] = useState<Messages[]>([]);
	const [messageErr, setMessageErr] = useState<String>("");
	const userData = useContext(UserData).user;

	// useEffect(() => {
	// 	userData.socket?.on('directChatMessage', (data: any) => {
	// 		try {
	// 			data = JSON.parse(data);
	// 			setMessages((messages) => [...messages, data]);
	// 		} catch (error) {
	// 		}
	// 	});
	// 	return () => {
	// 		userData.socket?.off('directChatMessage');
	// 	}
	// }, [userData.socket])


	return (
		<div className='text-white chat d-flex flex-column bg-degrader' style={{ zIndex: 2000 }}>
			<TitleChatPrivate player={player} />
			<div className='p-2 overflow-auto mt-auto text-black' id='messagens-chat'>
				<FormatMessages messagens={messages} user={userData} messageErr={messageErr} />
			</div>
			{/* <InputChats socket={userData.socket as Socket} obj={obj} disable={messageErr !== ""} /> */}
		</div>
	);
}
