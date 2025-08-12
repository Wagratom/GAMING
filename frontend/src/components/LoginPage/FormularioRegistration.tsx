import './Login.css';
import React, { useRef } from 'react';


type propsFormulario = {
	handleForm: React.Dispatch<React.SetStateAction<string>>
}

export default function Formulario(props: propsFormulario) {
	// Component that renders the register form
	// The HTML blocks are created in functions to facilitate code readability and are called within the form in the function's return

	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	const validateEqualPasswords = () => {
		if (passwordRef.current && confirmPasswordRef.current) {
			const password = passwordRef.current.value;
			const confirmPassword = confirmPasswordRef.current.value;

			if (password === confirmPassword) {
				confirmPasswordRef.current.classList.remove('is-invalid');
				confirmPasswordRef.current.classList.add('is-valid');
				passwordRef.current.classList.add('is-valid');
			} else {
				confirmPasswordRef.current.classList.remove('is-valid');
				confirmPasswordRef.current.classList.add('is-invalid');
				passwordRef.current.classList.remove('is-valid');
				passwordRef.current.classList.remove('is-invalid');
			}
		}
	}


	const FieldsForm = () => {
		return (
			<>
				<div className="form-group mb-3">
					<label htmlFor="username">username</label>
					<input type="text" className="form-control my-2" id="username" placeholder="Login Name" />
				</div>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">email address</label>
					<input type="email" className="form-control" id="email" placeholder="name@example.com"></input>
				</div>
				<div className="form-group mb-3">
					<label htmlFor="password">password</label>
					<input type="password" className="form-control my-2" placeholder="Password" ref={passwordRef} />
				</div>
				<div className="form-group mb-3">
					<label htmlFor="password">confirm password</label>
					<input
						type="password"
						className="form-control my-2"
						placeholder="Confirm Password"
						ref={confirmPasswordRef}
						onChange={validateEqualPasswords}
					/>
				</div>
			</>
		)
	}


	const Login_Register = () => {
		return (
			<div className='buttonsForm d-flex flex-column align-items-center'>
				<button type="submit" className="btn btn-primary w-75 d-block mb-2">Register</button>
				<span>Have an account?
					<span className='singUp' onClick={() => props.handleForm('Login')}> Sign in </span>
				</span>
			</div>
		)
	}


	return (
		<form className='w-100'>
			{FieldsForm()}
			{Login_Register()}
		</form>
	)
}
