import * as _ from 'lodash';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ApiService } from 'src/api/api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Recipe, IRecipe } from 'src/models/recipe';
import * as qs from 'qs';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  showSearchBar: boolean = true;

  @Input()
  limit?: number = 0;

  searchInput: FormControl = new FormControl('');
  searchSubscription: Subscription;

  sort = {
    name: -1
  };

  datas: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private translate: TranslateService, private api: ApiService) { }

  ngOnInit() {
    this.loadRecipes();
    this.updateSearchSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!_.isBoolean(this.showSearchBar)) {
      this.showSearchBar = coerceBooleanProperty(this.showSearchBar);
    }
    this.updateSearchSubscription();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription)
      this.searchSubscription.unsubscribe();
  }

  loadRecipes() {
    this.api.get(Recipe, 'recipes?' + this.buildQueryParams()).subscribe(result => {
      this.datas.next(result);
    });
  }

  updateSearchSubscription() {
    if (this.showSearchBar && !this.searchSubscription) {
      this.searchSubscription = this.listenSearchInput();
    } else if (!this.showSearchBar && this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      this.searchSubscription = null;
    }
  }

  listenSearchInput(): Subscription {
    return this.searchInput.valueChanges.pipe(
      filter(value => _.isString(value) && value.length > 2),
      debounceTime(600),
      distinctUntilChanged(),
      tap(() => {
        this.datas.next([]);
      }),
      switchMap(value => {
        return this.api.get(Recipe, 'recipes?' + this.buildQueryParams());
      })
    ).subscribe((result) => {
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
    if (this.searchInput && this.searchInput.value) {
      params.name = {
        $search: this.searchInput.value
      };
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
