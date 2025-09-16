import { FormEvent, useState, useRef } from "react";
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
	}

	return (
		<div className='position-absolute rounded top-50 start-50 p-3 shadow-grounps text-black translate-middle' style={{width: '300px'}}>
			<form onSubmit={handleSubmit}>
				<GrFormClose className='position-absolute top-0 end-0 m-1' size={25} onClick={() => setShowCreateChat(false)} />

				{/* logica para selecionar a imagem */}
				<div className='d-flex justify-content-center'>
					<img className='rounded-circle hover mb-3'
						src={bgPhotoEmpty}
						style={{ width: '100px', height: '100px' }}
						alt='foto para mostra que esta sem foto de perfil'
						onClick={() => inputPhotoChat.current ? inputPhotoChat.current.click() : null}
					/>
				</div>
				<input type='file' name='photoChat' className='d-none' ref={inputPhotoChat} />

				{/* input nome do chat */}
				<input type='text' name='nameChat' className='form-control shadow-grounps mb-3' placeholder='Nome do grupo' />

				{/* checkbox para selecionar o tipo do chat */}
				<div className='d-flex justify-content-between'>
					<div className="form-check">
						<input
							id="checkboxPrivate"
							name="privateChat"
							value="PRIVATE"
							type="checkbox"
							ref={checkboxPublic}
							className="form-check-input shadow-grounps mb-3-1"
							onClick={() => { checkboxProtect.current!.checked = false; handleShowInputPassword() }}
						>
						</input>
						<label className="form-check-label" htmlFor="checkboxPrivate">Publico </label>
					</div>
					<div className="form-check">
						<input
							id="checkboxProtect"
							name="protectChat"
							value="PUBLIC"
							type="checkbox"
							ref={checkboxProtect}
							className="form-check-input shadow-grounps"
							onClick={() => { checkboxPublic.current!.checked = false; handleShowInputPassword() }}>
						</input>
						<label className="form-check-label" htmlFor="checkboxProtect">Privado</label>
					</div>
				</div>
				{ShowInputPassword && (
					<input type='text' name='passwordChat' className='form-control shadow-grounps' placeholder='Senha do grupo' />
				)}
				<button className='btn btn-primary d-flex mt-4 justify-content-center w-100' type='submit'>Criar Grupo</button>
			</form>
		</div>
	);
}
