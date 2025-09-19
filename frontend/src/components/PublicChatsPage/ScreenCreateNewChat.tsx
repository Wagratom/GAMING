import { FormEvent, useRef, useState } from "react";
import { GrFormClose } from 'react-icons/gr';
import bgPhotoEmpty from '../../assets/game/bgPhotoEmpty.png';

type functionsChats = {
	setShowCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
	createNewChat: (form: FormData) => void;
}

export default function CreateNewChat({ setShowCreateChat, createNewChat }: functionsChats) {
	const [ShowInputPassword, setShowInputPassword] = useState(false);
	const inputPhotoChat = useRef<HTMLInputElement>(null);
	const checkboxPublic = useRef<HTMLInputElement>(null);
	const checkboxProtect = useRef<HTMLInputElement>(null);

	const handleShowInputPassword = (): void => {
		setShowInputPassword(!ShowInputPassword);
		if (checkboxProtect.current!.checked) {
			setShowInputPassword(true);
		} else {
			setShowInputPassword(false);
		}
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		setShowCreateChat(false);
		const name = formData.get('nameChat')?.toString() || '';

		if (name.length <= 0) {
			return;
		}
		createNewChat(formData);
	}

	return (
		<div className='position-absolute top-50 start-50 translate-middle create-chat-container'>
			<form onSubmit={handleSubmit}>
				<GrFormClose
					className='position-absolute top-0 end-0 m-2 create-chat-close'
					size={25}
					onClick={() => setShowCreateChat(false)}
				/>

				{/* imagem/avatar */}
				<div className='d-flex justify-content-center'>
					<img
						className='create-chat-avatar mb-3'
						src={bgPhotoEmpty}
						alt='foto do grupo'
						onClick={() => inputPhotoChat.current?.click()}
					/>
				</div>
				<input type='file' name='photoChat' className='d-none' ref={inputPhotoChat} />

				{/* nome */}
				<input
					type='text'
					name='nameChat'
					className='form-control create-chat-input'
					placeholder='Nome do grupo'
				/>

				{/* checkboxes */}
				<div className='d-flex justify-content-between mb-3'>
					<div className="form-check">
						<input
							id="checkboxPrivate"
							name="privateChat"
							value="PROTECT"
							type="checkbox"
							ref={checkboxPublic}
							className="form-check-input"
							onClick={() => { checkboxProtect.current!.checked = false; handleShowInputPassword() }}
						/>
						<label className="form-check-label" htmlFor="checkboxPrivate">Público</label>
					</div>
					<div className="form-check">
						<input
							id="checkboxProtect"
							name="protectChat"
							value="PUBLIC"
							type="checkbox"
							ref={checkboxProtect}
							className="form-check-input"
							onClick={() => { checkboxPublic.current!.checked = false; handleShowInputPassword() }}
						/>
						<label className="form-check-label" htmlFor="checkboxProtect">Protegido</label>
					</div>
				</div>

				{ShowInputPassword && (
					<input
						type='text'
						name='passwordChat'
						className='form-control create-chat-input'
						placeholder='Senha do grupo'
					/>
				)}

				<button className='w-100 mt-3 create-chat-btn' type='submit'>Criar Grupo</button>
			</form>
		</div>
	);
}
