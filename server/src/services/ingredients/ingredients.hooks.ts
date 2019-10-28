import * as authentication from '@feathersjs/authentication';
import { softDelete2 } from 'feathers-hooks-common';
import FixSoftDelete404 from '../../common/fix-404';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt'), softDelete2() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ softDelete2() ],
    find: [],
    get: [],
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
    remove: [ FixSoftDelete404() ]
  }
};
