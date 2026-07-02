export interface User {
  _id?: string,
  name?: string,
  nickname?: string,
  email: string,
  password?: string,
  role?: string,
  status?: boolean,
  avatar?: string,
  createdAt?: string,
  updatedAt?: string
}

export interface UserShow {
  _id: string,
  name: string,
  nickname: string,
  email: string,
  role: string,
  status: boolean,
  avatar: string,
  createdAt: string,
  updatedAt: string
}

export interface LoginUser {
  email: string,
  password: string
}

export interface UserRegister {
  name: string,
  nickname: string,
  email: string,
  password: string,
  role?: string,
  status?: boolean,
  avatar?: string
}


export interface ResponseUsers {
  msg: string,
  data: [User]
}
