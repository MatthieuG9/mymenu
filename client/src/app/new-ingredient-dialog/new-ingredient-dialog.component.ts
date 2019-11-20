import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


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
    @Inject(MAT_DIALOG_DATA) public data: NewIngredientDialogData) {
    this.ingredientName = data.name;
  }

  save() {

  }

  cancel() {
    this.dialogRef.close();
  }

}
