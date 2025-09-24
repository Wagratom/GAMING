import { useContext } from "react";
import { MessageDto, UserData } from '../../InitialPage/Contexts/Contexts';
import FormatMessages from "../FormatMessagens/FormatMessagens";
import InputChats from "../InputChats";


export default function MessagensArea({ messages, chatId }: {messages: MessageDto[], chatId: string }): JSX.Element {
	const userData = useContext(UserData).user;

	// useEffect(() => {
	// 	userData.socket?.on('chatMessage', (data: any) => {
	// 		try {
	// 			data = JSON.parse(data) as Messages;
	// 			setMessages((prevMessagens) => [...prevMessagens, data]);
	// 		} catch (error) {
	// 		}
	// 	});
	// 	return () => {
	// 		userData.socket?.emit('close-group', {chatId: id});
	// 		userData.socket?.off('chatMessage');
	// 	}
	// }, [userData.socket]);


	//TODO: adicionar logica de mostrar o erro


	return (
		<>
			<FormatMessages messages={messages} />
			<InputChats resourceSend={`/add-message-groups/${chatId}`}/>
		</>
	)
}
