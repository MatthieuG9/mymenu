import * as _ from 'lodash';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ApiService } from 'src/api/api.service';
import { Recipe, IRecipe, RecipeType, IRecipeDetails } from 'src/models/recipe';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-recipe',
  templateUrl: './add-edit-recipe.component.html',
  styleUrls: ['./add-edit-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditRecipeComponent implements OnInit {

  public mainForm: FormGroup;
  public maxDuration = 180;
  public currentRecipe: Recipe;

  get duration(): number {
    return this.mainForm && this.mainForm.get('duration').value;
  }

  set duration(val: number) {
    this.mainForm && this.mainForm.patchValue({ duration: val });
  }

  get instructionsControl(): FormArray {
    return this.getFormArray('instructions') as FormArray;
  }

  get ingredientsControl(): FormArray {
    return this.getFormArray('ingredients') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService) {
  }

  ngOnInit() {
    this.currentRecipe = this.route.snapshot.data['recipe'];
    this.buildFormGroup();
    if (this.currentRecipe) {
      this.patchFormGroup();
    }
  }

  buildFormGroup() {
    this.mainForm = this.fb.group({
      name: ['', Validators.required],
      duration: [10, [Validators.min(1), Validators.max(this.maxDuration)]],
      serving: [4, Validators.min(1)],
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

  patchFormGroup() {
    if (this.currentRecipe.details) {
      if (this.currentRecipe.details.instructions) {
        for (let i = 0; i < this.currentRecipe.details.instructions.length - 1; i++) {
          this.getFormArray('instructions').push(this.buildInstructionForm());
        }
      }
      if (this.currentRecipe.details.ingredients) {
        for (let i = 0; i < this.currentRecipe.details.ingredients.length - 1; i++) {
          this.getFormArray('ingredients').push(this.buildIngredientForm());
        }
      }
    }
    this.mainForm.patchValue(this.currentRecipe);
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
    this.api.save<Recipe>(Recipe, 'recipes', data as Recipe)
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
    if (this.currentRecipe) {
      result._id = this.currentRecipe._id;
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
