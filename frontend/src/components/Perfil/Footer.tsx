import { IoLogoInstagram } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { AiOutlineLinkedin } from "react-icons/ai";
import { TbFileTypeDoc } from "react-icons/tb";
import { GiLoveLetter } from "react-icons/gi";

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
		<footer style={cssFooter} id="footerProfile">
			<hr style={{ margin: 0 }} />
			<div style={contentFooter}>
				<div style={contentRedirectsIcons}>
					<a
						title="github"
						className="text-white"
						target="_blank"
						rel="noreferrer"
						type="button" href="https://github.com/Wagratom">
						<FaGithub size={30} />
					</a>
					<a
						title="instagram"
						className="text-white"
						target="_blank"
						rel="noreferrer"
						type="button" href="https://www.instagram.com/wagratom/">
						<IoLogoInstagram size={30} />
					</a>
					<a
						title="linkedin"
						className="text-white"
						target="_blank"
						rel="noreferrer"
						type="button" href="https://www.linkedin.com/in/wagraton-wallas/">
						<AiOutlineLinkedin size={30} />
					</a>
					<a
						title="currículo"
						className="text-white"
						href="wagratonCv.pdf" // Caminho do seu PDF na pasta public
						download='wagraton wallas cv' // Nome do arquivo que será baixado
					>
						<TbFileTypeDoc size={30} />
					</a>

					<a
						title="momento especial"
						className="text-white"
						target="_blank"
						rel="noreferrer"
						type="button" href="https://www.momentoespecial.com.br/">
						<GiLoveLetter size={30} />
					</a>
				</div>
			</div>
		</footer>
	)
}
