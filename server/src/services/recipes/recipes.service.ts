// Initializes the `Recipes` service on path `/recipes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Recipes } from './recipes.class';
import createModel from '../../models/recipes.model';
import hooks from './recipes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'recipes': Recipes & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/recipes', new Recipes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('recipes');

  service.hooks(hooks);
}
