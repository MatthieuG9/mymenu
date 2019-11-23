import * as _ from 'lodash';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ApiService } from 'src/api/api.service';
import { Recipe, IRecipe, RecipeType, IRecipeDetails } from 'src/models/recipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-recipe',
  templateUrl: './add-edit-recipe.component.html',
  styleUrls: ['./add-edit-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditRecipeComponent implements OnInit {

  public mainForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService) {
    this.buildFormGroup();
  }

  ngOnInit() {

  }

  buildFormGroup() {
    this.mainForm = this.fb.group({
      name: ['', Validators.required],
      type: ['link', Validators.required],
      url: ['', RxwebValidators.required({
        conditionalExpression: (x) => x.type == 'link'
      })
      ],
      details: this.fb.group({
        instructions: this.fb.array([this.buildInstructionForm()]),
        ingredients: this.fb.array([this.buildIngredientForm()])
      })
    });

    this.mainForm.patchValue({
      details: {
        instructions: [{ content: '' }]
      }
    });
  }

  buildInstructionForm(): FormGroup {
    return this.fb.group({
      content: ['']
    });
  }

  buildIngredientForm(): FormGroup {
    return this.fb.group({
      ingredientId: [''],
      quantity: [1, [Validators.required, Validators.min(0.001)]],
      unit: ['unit', [Validators.required]]
    });
  }

  typeIsLink(): boolean {
    return this.mainForm.get('type').value === 'link';
  }

  addRow(arrayName: string, i: number) {
    this.getFormArray(arrayName).insert(i + 1, arrayName == 'instructions' ? this.buildInstructionForm() : this.buildIngredientForm());
  }

  removeRow(arrayName: string, i: number) {
    this.getFormArray(arrayName).removeAt(i);
  }

  getFormArray(arrayName: string) {
    return this.mainForm.get('details').get(arrayName) as FormArray;
  }

  save() {
    let data = this.clean(this.mainForm.value);
    this.api.save<Recipe>(Recipe, 'recipes', data)
      .subscribe((result) => {
        console.log('Recipe saved', result);
        this.router.navigate(['/']);
      });
  }

  clean(srcData: any): IRecipe {
    let result: IRecipe = _.cloneDeep(srcData) as IRecipe;
    if (result.type == RecipeType.link) {
      delete result.details;
    } else {
      delete result.url;
      result.details = this.cleanRecipeDetails(result.details);
    }
    return result;
  }

  private cleanRecipeDetails(details: IRecipeDetails) {
    details = details || { ingredients: [], instructions: [] };
    details.instructions = _.filter(details.instructions, (x) => !!x.content);
    details.ingredients = _.filter(details.ingredients, (x) => !!x.ingredientId);
    return details;
  }
}
