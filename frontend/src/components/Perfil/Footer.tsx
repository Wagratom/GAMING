import { IoLogoInstagram } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { AiOutlineLinkedin } from "react-icons/ai";

export default function FolderPerfil(): JSX.Element {
	const cssFooter: React.CSSProperties = {
		position: 'fixed',
		bottom: '0',
		left: '50%',
		transform: 'translateX(-50%)',

		padding: '0 5rem 6rem 5rem',
		width: '100%',
		color: 'white',
	}

	const contentFooter: React.CSSProperties = {
		display: 'flex',
		width: '100%',
		justifyContent: 'center',
	}

	const contentRedirectsIcons: React.CSSProperties = {
		display: 'flex',
		gap: '1rem',
		marginTop: '0.5rem',
	}

	return (
		<footer style={cssFooter}>
			<hr />
			<div style={contentFooter}>
				<div style={contentRedirectsIcons}>
					<a
						className="text-white"
						target="_blank"
						rel="noreferrer"
						type="button" href="https://github.com/Wagratom">
						<FaGithub size={30} />
					</a>
					<a
						className="text-white"
						target="_blank"
						rel="noreferrer"
						type="button" href="https://www.instagram.com/wagratom/">
						<IoLogoInstagram size={30} />
					</a>
					<a
						className="text-white"
						target="_blank"
						rel="noreferrer"
						type="button" href="https://www.linkedin.com/in/wagraton-wallas/">
						<AiOutlineLinkedin size={30} />
					</a>
				</div>
			</div>
		</footer>
	)
}
