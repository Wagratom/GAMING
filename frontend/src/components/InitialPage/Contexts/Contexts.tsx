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

export type MatchInfo = {
  id: string;
  map: string;
  winner: UserDto;
  loser: UserDto;
  winnerScore: number;
  loserScore: number;
  createdAt: string;
};

export type ProfileDto = {
  id: string;
  nickname: string;
  avatar: string;
  online: boolean;
  token: string | null;
  coins: number;
  twoFA: boolean;
  criando_em: string | null;
  matches: {
    wins: MatchInfo[];
    losses: MatchInfo[];
  }
};

export type PlayerDto = {
  id: string,
  nickname: string,
  avatar: string,
  online: boolean,
  match_status: string
}

export type MessageDto = {
  id: string,
  content: string,
  sender: PlayerDto
  date: string;
}

export type ChatDataDto = {
  id: string,
  name: string,
  messages: MessageDto[],
  owner: PlayerDto,
  type: string,
  photo: string,
  adms: PlayerDto[],
  members: PlayerDto[],
  banned: PlayerDto[],
  kicked: PlayerDto[],
  mutted: PlayerDto[],
}

export type chatDto = {
  id: string;
  name: string;
  owner: UserDto;
  photoUrl: string;
  password: string;
  type: string;
  onlines: number;
};


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
