import { useState } from 'react';

import FormularioLogin from './FormularioLogin';
import FormularioRegistration from './FormularioRegistration';
import './Login.css';

import PhotoMobal from '../../assets/game/PhotoLoginPage.jpg'

export function Login() {
	const [handleForm, setHandleForm] = useState<string>('Login');


	const HtmlToMobile = () => {
		return (
			<>
				<div className='photoLoginInFormToMobile'>
					<img className='img-thumbnail' src={PhotoMobal} alt="image in pixel art style for a game titled 'SPACE PONG'. The layout features a space theme with a dark, starry background and colorful nebulae. In the background, on the left side, a small astronaut passing deep in red spacesuit with reflective helmet visor is floating in space. Below the astronaut, a small spaceship is represented. The right side prominently displays the game title 'SPACE PONG 42SP' in bold, 3D pixelated letters with an orange to red gradient, outlined in yellow. Above the title are the '42 São Paulo' and 'WW' logos in small, pixelated text. The overall design is vibrant and engaging, with a retro gaming aesthetic." />
				</div>
				<h1 className='singIn'>SING IN</h1>
			</>
		)
	}

	return (
		<div className='loginPage'>
			<div className='photoLoginBackground'></div>
			<div className='loginScreen'>
				<div className='formulario'>
					<div className='welcome mb-5'>
						<h1 className='text-center'>WELCOME TO &nbsp;</h1>
						<h1 className='text-center'>SPACE PONG</h1>
					</div>
					{HtmlToMobile()}
					{handleForm === 'Login' ? <FormularioLogin handleForm={setHandleForm} /> : <FormularioRegistration handleForm={setHandleForm}/>}
				</div>
				<div className='text-center photoLoginInLoginScreen'></div>
			</div>
		</div>
	);
}
