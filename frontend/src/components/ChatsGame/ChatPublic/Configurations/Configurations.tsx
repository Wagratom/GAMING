import { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { UserData } from "../../../InitialPage/Contexts/Contexts";
import { ChatContext } from "../OpenedPublicChat";
import AllButtons from "./AllButtons";

import "./../ChatPublic.css"; // 👈 Import do CSS

const rules: string[] = [
	"2 anos de Free Fire",
	"5 anos de experiência",
	"Inglês, Português, Hebraico, Grego e Angolano...",
	"Assembly, C/C++, Java, Malbolge...",
	"MySQL, PostgreSQL, Oracle Database, Dynamo...",
];

type propsConfigurations = {
	openOrClosedConf: () => void;
	chatName: string;
};

export default function Configurations(props: propsConfigurations): JSX.Element {
	const { chatData: { members, adms } } = useContext(ChatContext);
	const [showEditName, setShowEditName] = useState(false);
	const userData = useContext(UserData).user;

	return (
		<div className="configurations-panel">
			{/* Barra de título */}
			<div className="config-bar">
				<h5 className="m-0">Dados do Grupo</h5>
				<AiOutlineClose className="config-close" size={26} onClick={props.openOrClosedConf} />
			</div>

			{/* Perfil do grupo */}
			<div className="config-profile">
				<img
					className="config-photo"
					src="https://i.etsystatic.com/37688069/r/il/d3e600/5143421340/il_600x600.5143421340_sm1f.jpg"
					alt="Foto do grupo"
				/>
				<h3 className="config-name">
					{props.chatName}
					<BsFillPencilFill
						size={18}
						className="config-edit"
						onClick={() => setShowEditName(!showEditName)}
					/>
				</h3>
				{showEditName && (
					<input
						type="text"
						className="config-input"
						placeholder="Novo nome do grupo"
					/>
				)}
				<h4 className="config-members">Grupo – {members.length} participantes</h4>
			</div>

			{/* Regras */}
			<div className="config-rules">
				<h4>Regras:</h4>
				<ul>
					{rules.map((rule, index) => (
						<li key={index}>{rule}</li>
					))}
				</ul>
			</div>

			{/* Botões extras para admins */}
			{adms.find((item) => item.id === userData.id) ? <AllButtons /> : null}
		</div>
	);
}
