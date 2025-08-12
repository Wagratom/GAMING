import React from 'react';
import './Login.css';

type propsFormulario = {
	handleForm: React.Dispatch<React.SetStateAction<string>>
}
export default function FormularioLogin(props: propsFormulario) {
	// Component that renders the login form
	// The HTML blocks are created in functions to facilitate code readability and are called within the form in the function's return

	const formLogin = () => {
		return (
			<>
				<div className="form-group mb-3">
					<label htmlFor="email">username</label>
					<input type="email" className="form-control my-2" id="email" placeholder="Login Name" />
				</div>
				<div className="form-group mb-3">
					<label htmlFor="password">password</label>
					<input type="password" className="form-control my-2" id="password" placeholder="Password" />
				</div>
			</>
		)
	}


	const ForgetPassword = () => {
		return (
			<div className='d-flex justify-content-between mb-5'>
				<a style={{ color: '#b61758' }} href="bla">Forget your password?</a>
			</div>
		)
	}


	const LoginButton = () => {
		return (
			<div className='buttonsForm d-flex flex-column align-items-center'>
				{/* botão para enviar o formulario */}
				<button type="submit" className="btn btn-primary w-75 d-block mb-2">Login</button>
				{/* botão para trocar de logar para registrar */}
				<span>Need an account?
					<span className='singUp' onClick={() => props.handleForm('Register')}> Sign up </span>
				</span>
			</div>
		)
	}


	return (
		<form className='w-100'>
			{formLogin()}
			{ForgetPassword()}
			{LoginButton()}
		</form>
	)
}
