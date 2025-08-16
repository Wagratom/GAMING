import { IoLogoInstagram } from "react-icons/io";
import { FaGithub } from "react-icons/fa";

export default function FolderSettingsGame(): JSX.Element {
	return (
		<footer className='text-center pt-2' >
			<FaGithub size={30} style={{ marginRight: '10px' }} />
			<IoLogoInstagram size={30} />
		</footer>
	)
}
