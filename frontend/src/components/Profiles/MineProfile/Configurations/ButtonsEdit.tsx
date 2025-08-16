import ButtonsConf from "./ButtonsConf"

type propsButtonEdit = {
	setEditProfile: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function ButtonEdit(props: propsButtonEdit): JSX.Element {
	return (
		<>
			<ButtonsConf addedInputNameDef180={() => { props.setEditProfile(false) }}
				content='Cancel'
			/>
			<ButtonsConf addedInputNameDef180={() => {}}
				content='Save'
				type="submit"
			/>
		</>
	)
}
