import { useContext } from "react";
import InputChats from "../InputChats";
import { Player, UserData } from '../../InitialPage/Contexts/Contexts';
import FormatMessages from "../FormatMessagens/FormatMessagens";

export default function MessagensArea({ friend }: { friend: Player }): JSX.Element {
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
			<FormatMessages friend={friend}/>
			<InputChats
				obj={{}}
				disable={false}
			/>
		</>
	)
}
