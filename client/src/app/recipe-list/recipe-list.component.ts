import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Recipe, IRecipe } from 'src/models/recipe';
import * as qs from 'qs';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  @Input()
  showSearchBar?: boolean;

  @Input()
  limit?: number = 0;

  sort = {
    name: -1
  };

  datas: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private translate: TranslateService, private api: ApiService) { }

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.api.get(Recipe, 'recipes?' + this.buildQueryParams()).subscribe(result => {
      this.datas.next(result);
    });
  }

  buildQueryParams(): string {
    let params: any = {
      $sort: this.sort
    };
    if (this.limit) {
      params.$limit = this.limit;
    }
    return qs.stringify(params);
  }

  delete(recipe: IRecipe) {
    if (recipe && recipe._id) {
      const dialogData = new ConfirmDialogModel('RECIPE.CONFIRM_DELETE', 'RECIPE.MESSAGE_DELETE');

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.api.deleteById('recipes', recipe._id).subscribe(x => {
            this.snackBar.open(this.translate.instant('RECIPE.DELETED'));
            this.loadRecipes();
          });
        }
      });
    }
  }
}
