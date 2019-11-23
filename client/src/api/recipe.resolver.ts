import { Injectable } from '@angular/core';
import { Recipe } from 'src/models/recipe';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from './api.service';
import { ApiModule } from './api.module';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: ApiModule
})
export class RecipeResolver implements Resolve<Recipe> {

    constructor(private api: ApiService) { }

    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<any> | Promise<any> {
        return this.api.getOne(Recipe, 'recipes/' + route.params.id);
    }

}