import React from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";

type propsFormulario = {
	handleForm: React.Dispatch<React.SetStateAction<string>>
}

export default function FormularioLogin(props: propsFormulario) {
	// Component that renders the login form
	// The HTML blocks are created in functions to facilitate code readability and are called within the form in the function's return
	const navidate = useNavigate();

	function sendFormLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();


		const formData = new FormData(event.currentTarget);
		const jsonData = Object.fromEntries(formData.entries());

		fetch(`${process.env.REACT_APP_API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonData)
		})
			.then(res => navidate("/game"))
			.catch(error => {
				console.error("Erro ao cadastrar:", error);
			});
	}

	const formLogin = () => {
		return (
			<>
				<div className="form-group mb-3">
					<label htmlFor="nicknameiD">username</label>
					<input name="nickname" type="nickname" className="form-control my-2" id="nicknameiD" placeholder="Login Name" />
				</div>
				<div className="form-group mb-3">
					<label htmlFor="passwordiD">password</label>
					<input name="password" type="password" className="form-control my-2" id="passwordiD" placeholder="Password" />
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
		<form className='w-100' onSubmit={sendFormLogin}>
			{formLogin()}
			{ForgetPassword()}
			{LoginButton()}
		</form>
	)
}
