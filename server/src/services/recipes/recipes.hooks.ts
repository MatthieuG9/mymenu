import * as authentication from '@feathersjs/authentication';
import { setField } from 'feathers-authentication-hooks';
import { softDelete2, fastJoin } from 'feathers-hooks-common';
import FixSoftDelete404 from '../../common/fix-404';
import { HookContext } from '@feathersjs/feathers';
import search from 'feathers-mongodb-fuzzy-search';
import { ifApiIsNotPublic } from '../../common/hook';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const setOwnerInBody = setField({
  from: 'params.user._id',
  as: 'data.ownerId'
});

const filterByOwnerId = setField({
  from: 'params.user._id',
  as: 'params.query.ownerId'
});

const filterByOwnerIfNotPublic = ifApiIsNotPublic(filterByOwnerId);

const ingredientResolve = {
  joins: {
    ingredient: () => async (recipe: any, context: HookContext) => {
      if (context.params && context.params.query && context.params.query.$populate) {
        for (let ingredient of recipe.details.ingredients) {
          if (ingredient.ingredientId) {
            let data = await context.app.service('ingredients').get(ingredient.ingredientId);
            Object.assign(ingredient, data);
          }
        }
      }
    }
  }
};

export default {
  before: {
    all: [
      ifApiIsNotPublic(authenticate('jwt')),
      softDelete2()
    ],
    find: [
      search({
        fields: ['name']
      }),
      filterByOwnerIfNotPublic
    ],
    get: [filterByOwnerIfNotPublic],
    create: [filterByOwnerIfNotPublic],
    update: [filterByOwnerIfNotPublic],
    patch: [filterByOwnerIfNotPublic],
    remove: [filterByOwnerIfNotPublic]
  },

  after: {
    all: [softDelete2()],
    find: [],
    get: [
      fastJoin(ingredientResolve)
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [FixSoftDelete404()]
  }
};
