import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatRadioModule, MatFormFieldModule, MatInputModule, MatIconModule, MatAutocompleteModule, MatSelectModule, MatProgressSpinnerModule, MatDialogModule, MatSliderModule, MatListModule, MatSnackBarModule, MatMenuModule } from '@angular/material';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AvatarModule } from 'ngx-avatar';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AddEditRecipeComponent } from './add-edit-recipe/add-edit-recipe.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators"
import { AuthModule } from 'src/auth/auth.module';
import { ApiModule } from 'src/api/api.module';
import { RecipeIngredientFormComponent } from './recipe-ingredient-form/recipe-ingredient-form.component';
import { NewIngredientDialogComponent } from './new-ingredient-dialog/new-ingredient-dialog.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ShowRecipeComponent } from './show-recipe/show-recipe.component';
import { NavbarComponent } from './navbar/navbar.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AddEditRecipeComponent,
    RecipeIngredientFormComponent,
    NewIngredientDialogComponent,
    RecipeListComponent,
    ConfirmDialogComponent,
    ShowRecipeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSliderModule,
    MatListModule,
    MatSnackBarModule,
    MatMenuModule,
    HttpClientModule,
    AvatarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AuthModule,
    ApiModule
  ],
  entryComponents: [
    NewIngredientDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('fr');

    let browserLang = translate.getBrowserLang();
    //translate.use('en');
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
  }
}
