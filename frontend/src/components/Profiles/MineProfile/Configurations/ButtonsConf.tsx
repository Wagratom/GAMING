
type PropsButtonEdit = {
	addedInputNameDef180: () => void;
	content: string;
	type?: "button" | "submit" | "reset" | undefined;
}
export default function ButtonsConf(props: PropsButtonEdit): JSX.Element {
	return (
		<button
			className='rounded bg-info px-3 my-3 styleButton'
			onClick={props.addedInputNameDef180}
			type={props.type ? props.type : 'button'}
		>
			<p>{props.content}</p>
		</button>
	)
}
