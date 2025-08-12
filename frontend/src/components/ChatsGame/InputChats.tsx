import { useRef } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { Socket } from 'socket.io-client';

type PropsInputChats = {
	socket: Socket,
	obj: any,
	disable: boolean
}

export default function InputChats(props: PropsInputChats) {
	const inputChat = useRef<HTMLInputElement>(null);

	const sendMessageClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
		props.obj.content = inputChat.current?.value as string;
		props.socket.emit(props.obj.route, props.obj);
		if (inputChat.current?.value) {
			inputChat.current.value = '';
		}
	}

	const sendMessageEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			props.obj.content = event.currentTarget.value;
			props.socket.emit(props.obj.route, props.obj);
			event.currentTarget.value = '';
		}
		event.stopPropagation();
	}

	const getInput = (): JSX.Element => {
		if (props.disable) {
			return (
				<input
					className='remove-format-input'
					type='text'
					ref={inputChat}
					placeholder='Digite sua mensagem'
					onKeyDown={sendMessageEnter}
					disabled
				/>
			)
		}
		return (
			<input
				className='remove-format-input'
				type='text'
				ref={inputChat}
				placeholder='Digite sua mensagem'
				onKeyDown={sendMessageEnter}
			/>
		)
	}

	return (
		<div className='d-flex align-items-center'>
			{getInput()}
			<button
				className='remove-format-button'>
				<AiOutlineSend size={30}
					onClick={sendMessageClick}
				/>
			</button>
		</div>
	)
}
