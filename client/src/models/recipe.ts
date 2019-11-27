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
  details?: IRecipeDetails,
  duration: number,
  serving: number
}

export class Recipe implements IRecipe {
  _id?: number | string;
  name: string;
  ownerId: string | number;
  type: RecipeType;
  url?: string;
  details?: IRecipeDetails;
  duration: number;
  serving: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  get link(): string {
    return this.type === RecipeType.link ? this.url : '/recipe/' + this._id + '/show';
  }

  get editLink(): string {
    return '/recipe/' + this._id + '/edit';
  }

  get linkTarget(): string {
    return this.type === RecipeType.link ? '_blank' : '_selft';
  }
}