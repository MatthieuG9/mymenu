import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { AddEditRecipeComponent } from './add-edit-recipe/add-edit-recipe.component';
import { RecipeResolver } from 'src/api/recipe.resolver';
import { ShowRecipeComponent } from './show-recipe/show-recipe.component';


const routes: Routes = [
  {
    path: 'recipe/:id/show',
    component: ShowRecipeComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
    resolve: {
      recipe: RecipeResolver
    },
    data: { populate: true }
  },
  {
    path: 'recipe/:id/edit',
    component: AddEditRecipeComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
    resolve: {
      recipe: RecipeResolver
    }
  },
  {
    path: 'recipe/add',
    component: AddEditRecipeComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
