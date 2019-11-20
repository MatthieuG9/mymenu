import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/models/ingredient';
import { IngredientUnit } from 'src/models/recipe';

@Component({
  selector: 'app-recipe-ingredient-form',
  templateUrl: './recipe-ingredient-form.component.html',
  styleUrls: ['./recipe-ingredient-form.component.scss']
})
export class RecipeIngredientFormComponent implements OnChanges
{
  @Input()
  formArray: FormArray;
  @Input()
  formArrayIndex: number;

  formGroup: FormGroup;
  ready: boolean;

  filteredIngredients: Observable<Ingredient[]>;

  units = [ IngredientUnit.unit, IngredientUnit.g, IngredientUnit.ml ];

  constructor() {
  
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formGroup = this.formArray && this.formArray.get(this.formArrayIndex.toString()) as FormGroup || null;
    this.ready = !!this.formGroup;
  }


}