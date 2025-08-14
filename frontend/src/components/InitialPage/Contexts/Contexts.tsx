import axios from "axios";
import { createContext } from "react";
import { Socket } from "socket.io-client";

export type UserDto = {
  id: string;
  nickname: string;
  avatar: string;
  token: string | null;
  coins: number;
  twoFA: boolean;
  socket: Socket | undefined;
  criando_em: string | null;
};

// Tipo do contexto
type UserContextType = {
  user: UserDto;
  updateDataUser: (data: Partial<UserDto>) => void;
};



// Contexto
export const UserData = createContext<UserContextType>({
  user: {} as UserDto,
  updateDataUser: () => {},
});
