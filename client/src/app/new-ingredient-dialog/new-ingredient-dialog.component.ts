import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/api/api.service';
import { Ingredient } from 'src/models/ingredient';


export interface NewIngredientDialogData {
  name: string;
}


@Component({
  selector: 'app-new-ingredient-dialog',
  templateUrl: './new-ingredient-dialog.component.html',
  styleUrls: ['./new-ingredient-dialog.component.scss']
})
export class NewIngredientDialogComponent {

  ingredientName: string = '';

  constructor(public dialogRef: MatDialogRef<NewIngredientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewIngredientDialogData, private api: ApiService) {
    this.ingredientName = data.name;
  }

  save() {
    this.api.postOne(Ingredient, 'ingredients', { name: this.ingredientName })
      .subscribe(savedIngredient => {
        this.dialogRef.close(savedIngredient);
      });
  }

  cancel() {
    this.dialogRef.close();
  }

}
