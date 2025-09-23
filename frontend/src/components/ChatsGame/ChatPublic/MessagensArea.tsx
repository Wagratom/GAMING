import { useContext } from "react";
import InputChats from "../InputChats";
import { MessageDto, PlayerDto, UserData } from '../../InitialPage/Contexts/Contexts';
import FormatMessages from "../FormatMessagens/FormatMessagens";

export default function MessagensArea({ friend, messages }: { friend: PlayerDto, messages: MessageDto[] }): JSX.Element {
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
	if (!friend) {
		return <div></div>
	}

	return (
		<>
			<FormatMessages messages={messages}/>
			{/* <InputChats
				obj={{}}
				disable={false}
			/> */}
		</>
	)
}
