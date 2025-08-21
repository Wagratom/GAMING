import FormatMessages from '../FormatMessagens/FormatMessagens';
import './ChatPrivate.css'
import TitleChatPrivate from './Title';
import { Player } from '../../InitialPage/Contexts/Contexts'


export default function ChatPrivate({ player }: { player: Player }) {

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
				<FormatMessages/>
			</div>
			{/* <InputChats socket={userData.socket as Socket} obj={obj} disable={messageErr !== ""} /> */}
		</div>
	);
}
