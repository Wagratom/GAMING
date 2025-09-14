import { useContext } from "react";
import { ChatContext } from "../ChatPublic";
import Perfil from "./Perfil";
import Rules from "./Rules";
import Bar from "./Bar";
import { UserData } from '../../../InitialPage/Contexts/Contexts';
import AllButtons from './AllButtons';

const rules: string[] = [
	"2 anos de Free Fire",
	"5 anos de experiência",
	"Inglês, Português, Hebraico, Grego e Angolano...",
	"Assembly, C/C++, Java, Malbolge...",
	"MySQL, PostgreSQL, Oracle Database, Dynamo...",
]


type propsConfigurations = {
	openOrClosedConf: () => void,
	chatName: string,
}

export default function Configurations(props: propsConfigurations): JSX.Element {
	const { chatData: { members, admin } } = useContext(ChatContext);
	const userData = useContext(UserData).user;

	return (
		<div className="position-absolute bg-dark text-center rounded h-100 w-50 overflow-auto top-0 end-0">
			<Bar openOrClosedConf={props.openOrClosedConf} />
			<Perfil chatName={props.chatName}
				chatPhoto="https://i.etsystatic.com/37688069/r/il/d3e600/5143421340/il_600x600.5143421340_sm1f.jpg"
				numberMembers={members.length}
			/>
			<Rules rules={rules} />
			{admin.find((item) => item.id === userData.id) ? <AllButtons /> : null}
		</div>
	);
}
