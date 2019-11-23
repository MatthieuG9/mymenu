import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from 'src/models/recipe';
import * as qs from 'qs';

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

  constructor(private api: ApiService) { }

  ngOnInit() {
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
}
