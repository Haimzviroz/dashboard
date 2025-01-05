export interface IUserLogin{
  username: string;
  password: string
}

export interface Auth {
  accessToken: string;
  refreshToken: string;
}