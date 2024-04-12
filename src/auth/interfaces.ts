export interface user {
  id: number;
  username: string;
  login: string;
  password: string;
}

export interface createUser {
  login: string;
  password: string;
  username?: string;
}

export interface loginUser {
  login: string;
  password: string;
}
