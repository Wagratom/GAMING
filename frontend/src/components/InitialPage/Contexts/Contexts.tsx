import axios from "axios";
import { createContext } from "react";
import { Socket } from "socket.io-client";

export type UserDto = {
  id: string;
  nickname: string;
  avatar: string;
  online: boolean;
  token: string | null;
  coins: number;
  twoFA: boolean;
  socket: Socket | undefined;
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
