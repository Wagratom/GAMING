import FormatMessages from '../FormatMessagens/FormatMessagens';
import './ChatPrivate.css'
import TitleChatPrivate from './Title';
import { PlayerDto } from '../../InitialPage/Contexts/Contexts'
import InputChats from '../InputChats';


export default function ChatPrivate({ friend }: { friend: PlayerDto }) {
	return (
		<div className='text-white chat d-flex flex-column bg-degrader' style={{ zIndex: 2000 }}>
			<TitleChatPrivate friend={friend} />
			<div className='p-2 overflow-auto mt-auto text-black' id='messagens-chat'>
				<FormatMessages friend={friend} />
			</div>
			<InputChats />
		</div>
	);
}
