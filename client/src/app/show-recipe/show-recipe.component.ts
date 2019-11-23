import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/models/recipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrls: ['./show-recipe.component.scss']
})
export class ShowRecipeComponent implements OnInit {

  recipe: Recipe;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.recipe = this.route.snapshot.data['recipe'];
  }

}
