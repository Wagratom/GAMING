import { useEffect, useState } from 'react';
import FormularioLogin from './FormularioLogin';
import FormularioRegistration from './FormularioRegistration';
import PhotoMobal from '../../assets/game/PhotoLoginPage.jpg';
import './Login.css';

export function Login() {
	const [handleForm, setHandleForm] = useState<'Login' | 'Register'>('Login');
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
	const [showWarning, setShowWarning] = useState<boolean>(false);

	// Monitora o tamanho da tela
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 1024);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Mostra o aviso se for mobile
	useEffect(() => {
		if (isMobile) {
			setShowWarning(true);
		}
	}, [isMobile]);

	const HtmlToMobile = () => (
		<>
			<div className='photoLoginInFormToMobile'>
				<img
					className='img-thumbnail'
					src={PhotoMobal}
					alt="Pixel art for a game titled 'SPACE PONG', with astronaut, spaceship, and colorful space background."
				/>
			</div>
			<h1 className='singIn'>SIGN IN</h1>
		</>
	);

	return (
		<div className='loginPage'>
			{showWarning && (
				<div className='mobile-warning-modal'>
					<div className='mobile-warning-content'>
						<h2>🚀 Tela muito pequena!</h2>
						<p>
							Este portfólio foi criado pensando em dispositivos maiores.
							Alguns elementos podem não funcionar corretamente em telas pequenas.
						</p>
						<button onClick={() => setShowWarning(false)}>Entendi</button>
					</div>
				</div>
			)}

			<div className='photoLoginBackground'></div>
			<div className='loginScreen'>
				<div className='formulario'>
					<div className='welcome mb-5'>
						<h1 className='text-center'>WELCOME TO &nbsp;</h1>
						<h1 className='text-center'>SPACE PONG</h1>
					</div>
					{HtmlToMobile()}
					{handleForm === 'Login' ? (
						<FormularioLogin handleForm={setHandleForm} />
					) : (
						<FormularioRegistration handleForm={setHandleForm} />
					)}
				</div>
				<div className='text-center photoLoginInLoginScreen'></div>
			</div>
		</div>
	);
}
