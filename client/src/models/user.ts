
export interface IUser {
  _id: number | string;
  email: string;
  googleId?: string;
  profilePicture?: string;
}

export class User implements IUser {
  _id: number | string;
  email: string = '';
  googleId?: string;
  profilePicture?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}