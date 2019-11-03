
export interface IUser {
    _id: number | string;
    email: string;
  }
  
  export class User implements IUser {
    _id: number | string;
    email: string = "";
    
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }