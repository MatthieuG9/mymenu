export interface IIngredient {
    _id?: number | string;
    name: string;
  }
  
  export class Ingredient implements IIngredient {
    _id?: number | string;
    name: string;
    
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }