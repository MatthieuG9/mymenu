import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Ingredient, IIngredient } from 'src/models/ingredient';
import { IngredientUnit } from 'src/models/recipe';
import { filter, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ApiService } from 'src/api/api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-recipe-ingredient-form',
  templateUrl: './recipe-ingredient-form.component.html',
  styleUrls: ['./recipe-ingredient-form.component.scss']
})
export class RecipeIngredientFormComponent implements OnInit, OnChanges {
  @Input()
  formArray: FormArray;
  @Input()
  formArrayIndex: number;

  formGroup: FormGroup;
  searchInput = new FormControl('');
  ready: boolean;
  isLoading: boolean = false;

  filteredIngredients = new BehaviorSubject<Ingredient[]>([]);

  units = [IngredientUnit.unit, IngredientUnit.g, IngredientUnit.ml];

  constructor(private api: ApiService) {

  }

  ngOnInit(): void {
    this.startListenIngredientSearchInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formGroup = this.formArray && this.formArray.get(this.formArrayIndex.toString()) as FormGroup || null;
    this.ready = !!this.formGroup;
  }

  startListenIngredientSearchInput() {
    this.searchInput.valueChanges.pipe(
      filter(value => _.isString(value) && value.length > 3),
      debounceTime(600),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.filteredIngredients.next([]);
      }),
      switchMap(value => {
        return this.api.findIngredients(value, 10);
      })
    ).subscribe((result) => {
      this.isLoading = false;
      this.filteredIngredients.next(result);
    });
  }

  displayIngredient(value: IIngredient | null) {
    return value && value.name || '';
  }

  selectIngredient(event: MatAutocompleteSelectedEvent) {
    this.formGroup.patchValue({
      ingredientId: event.option.value && event.option.value._id || null
    });
  }

}