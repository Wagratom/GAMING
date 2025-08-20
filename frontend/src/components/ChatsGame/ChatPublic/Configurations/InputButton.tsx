type propsInputButton = {
	function: (event: React.KeyboardEvent<HTMLInputElement>) => void,
	placeholder?: string,
}

export default function InputButton(props: propsInputButton): JSX.Element {
	return (
		<input
			type="text"
			className="remove-format-input"
			placeholder={props.placeholder ? props.placeholder : "Digite o nome do usuário" }
			onKeyDown={props.function}
		/>
	)
}
