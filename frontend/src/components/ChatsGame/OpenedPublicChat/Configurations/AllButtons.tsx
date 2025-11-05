import Button from "./Button";
import Cookies from "js-cookie";
import axios from "axios";
import AlterPassword from "./AlterPassword";
import ButtonTime from "./KickMember";

import { MdOutlinePersonAddDisabled, MdDeleteSweep } from 'react-icons/md';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { GiBroadDagger } from 'react-icons/gi';
import { MdBlock } from "react-icons/md";
import { FormEvent, useContext } from "react";
import { ChatContext } from "../OpenedPublicChat";
import { UserData } from "../../../InitialPage/Contexts/Contexts";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { BiMessageRoundedX } from "react-icons/bi";


export default function AllButtons(): JSX.Element {
	const { chatData: { name, id } } = useContext(ChatContext);
	const dataUser = useContext(UserData).user;

	async function getUserId(avatar_name: string): Promise<string> {
		const users = await axios.get(`${process.env.REACT_APP_HOST_URL}/users/find-all`, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420"
			},
		})
		return users.data.find((user: any) => user.avatar_name === avatar_name)?.id
	}

	const addedNewMember = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return;
	}

	const addAdm = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return;
	}

	const removedAdm = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return;
	}

	const banMember = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return;
	}

	const deleteChat = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return;
		if (event.currentTarget.value !== name) return;
	}

	const removePassword = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") return;
		axios.post(`${process.env.REACT_APP_HOST_URL}/chatroom/remove-password-group`, {
			chat_name: name,
			password: event.currentTarget.value,
		}, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420"
			}
		})
			.then(() => { })
			.catch(() => { })
	}

	const changePassword = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		axios.post(`${process.env.REACT_APP_HOST_URL}/chatroom/change-password-group`, {
			chat_name: name,
			old_password: form.get('password'),
			new_password: form.get('newPassword'),
			confirm_password: form.get('confirmNewPassword'),
		}, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420"
			}
		})
			.then(() => { })
			.catch(() => { })
	}

	return (
		<div className="p-3 text-start position-relative">
			<Button
				Icon={AiOutlineUserAdd}
				content="Adicionar Pessoas"
				function={addedNewMember}
			/>
			<Button
				Icon={GiBroadDagger}
				content="Adicionar Administrador"
				function={addAdm}
			/>
			<Button
				Icon={GiBroadDagger}
				content="Remover Administrador"
				function={removedAdm}
			/>
			<Button
				Icon={MdOutlinePersonAddDisabled}
				content="Banir Tripulante"
				function={banMember}
			/>
			<ButtonTime
				Icon={MdBlock}
				content="Chutar Tripulante"
				getUserId={getUserId}
				my_id={dataUser.id}
				chat_name={name}
				chat_id={id}
				id={"kick"}
				route="kick-member-group"
			/>

			<ButtonTime
				Icon={BiMessageRoundedX}
				content="Mutar Tripulante"
				getUserId={getUserId}
				my_id={dataUser.id}
				chat_name={name}
				chat_id={id}
				id={"mute"}
				route="mute-member-group"
			/>

			<AlterPassword funcChange={changePassword} />
			<Button
				Icon={MdDeleteSweep}
				content="Apagar Grupo"
				function={deleteChat}
			/>

			<Button
				Icon={IoIosRemoveCircleOutline}
				content="remover senha"
				function={removePassword}
			/>

		</div>
	)
}
//TODO: Alter password Bug
