import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

type propsFormulario = {
	handleForm: React.Dispatch<React.SetStateAction<"Register" | "Login">>
}

export default function FormularioLogin({ handleForm }: propsFormulario) {
	// Component that renders the login form
	// The HTML blocks are created in functions to facilitate code readability and are called within the form in the function's return
	const navidate = useNavigate();
	const [loginInlivado, setLoginInvalido] = useState<boolean>(false)

	function sendFormLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();


		const formData = new FormData(event.currentTarget);
		const jsonData = Object.fromEntries(formData.entries());

		axios.post(`${process.env.REACT_APP_API_URL}/login`, jsonData)
			.then(response => {
				localStorage.setItem("token", response.data.token);
				navidate("/game");
			})
			.catch(error => {
				if (error.response.status === '403') {
					setLoginInvalido(true)
				}
				console.error("Erro ao logar:", error);
			});
	}

	const formLogin = () => {
		return (
			<>
				{loginInlivado && (
					<div className='d-flex justify-content-center mb-3'>
						<p style={{ color: '#ff0909ff' }}>Login invalido</p>
					</div>
				)}
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
				<p style={{ color: '#b61758' }}>Forget your password?</p>
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
					<span className='singUp' onClick={() => handleForm('Register')}> Sign up </span>
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
