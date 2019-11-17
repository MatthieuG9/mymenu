export enum RecipeType { link = 'link', details = 'details' };
export enum IngredientUnit { unit = 'unit', g = 'g', ml = 'ml' };

export interface IRecipeInstruction {
  content: string
}

export interface IRecipeIngredient {
  ingredientId: number | string,
  quantity: number,
  unit: IngredientUnit
}

export interface IRecipeDetails {
  instructions: IRecipeInstruction[],
  ingredients: IRecipeIngredient[]
}

export interface IRecipe {
    _id?: number | string;
    name: string;
    ownerId: number | string,
    type: RecipeType,
    url?: string,
    details? : IRecipeDetails
  }
  
  export class Recipe implements IRecipe {
    _id?: number | string;
    name: string;
    ownerId: string | number;
    type: RecipeType;
    url?: string;
    details?: IRecipeDetails;
    
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }