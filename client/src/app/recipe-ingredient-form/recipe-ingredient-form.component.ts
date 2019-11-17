import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/models/ingredient';
import { IngredientUnit } from 'src/models/recipe';

@Component({
  selector: 'app-recipe-ingredient-form',
  templateUrl: './recipe-ingredient-form.component.html',
  styleUrls: ['./recipe-ingredient-form.component.scss']
})
export class RecipeIngredientFormComponent
{
  @Input()
  ingredientFormGroup: FormGroup;

  filteredIngredients: Observable<Ingredient[]>;

  units = [ IngredientUnit.unit, IngredientUnit.g, IngredientUnit.ml ];

  constructor() {
  
  }


}