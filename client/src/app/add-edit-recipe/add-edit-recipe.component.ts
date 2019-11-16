import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-add-edit-recipe',
  templateUrl: './add-edit-recipe.component.html',
  styleUrls: ['./add-edit-recipe.component.scss']
})
export class AddEditRecipeComponent implements OnInit {

  public mainForm:FormGroup;

  constructor(private fb: FormBuilder) {
    this.buildFormGroup();
   }

  ngOnInit() {

  }

  buildFormGroup() {
    this.mainForm = this.fb.group({
      name: [ '', Validators.required], 
      type: [ 'link', Validators.required],
      url: [ '', RxwebValidators.required({
          conditionalExpression:(x)=>x.type == 'link'
        }) 
      ],
      details: this.fb.group({
        instructions: this.fb.array([ this.buildInstructionForm() ]),
        ingredients: this.fb.array([ this.buildIngredientForm()])
      })
    });
  }

  buildInstructionForm(): FormControl {
    return this.fb.control({ value: ''});
  }

  buildIngredientForm(): FormGroup {
    return this.fb.group({
      ingredientId: '',
      quantity: [ 1, [ Validators.required, Validators.min(0.001)] ],
      unit: [ 'unit', [ Validators.required ]]
    });
  }

  typeIsLink(): boolean {
    return this.mainForm.get('type').value === 'link';
  }
}
