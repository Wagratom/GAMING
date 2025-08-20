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

export type Players = {
  id: string,
  avatar: string,
  nickname: string,
  avatar_name: string,
  online: boolean,
  match_status: string
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
