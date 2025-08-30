import { createContext } from "react";

export type UserDto = {
  id: string;
  nickname: string;
  avatar: string;
  online: boolean;
  token: string | null;
  coins: number;
  twoFA: boolean;
  criando_em: string | null;
};

export type PlayerDto = {
  id: string,
  avatar: string,
  nickname: string,
  avatar_name: string,
  online: boolean,
  match_status: string
}

export type MessageDto = {
  id: string,
  content: string,
  sender: PlayerDto
  criando_em: string;
}

export type ChatDataDto = {
  id: string,
  name: string,
  photo: string,
  members: PlayerDto[],
  banned: PlayerDto[],
  kicked: PlayerDto[],
  admin: PlayerDto[],
  mutted: { id: string }[],
  message: MessageDto[],
}



// Tipo do contexto
type UserContextType = {
  user: UserDto;
  updateDataUser: (data: Partial<UserDto>) => void;
};


// Contexto
export const UserData = createContext<UserContextType>({
  user: {} as UserDto,
  updateDataUser: () => { },
});
