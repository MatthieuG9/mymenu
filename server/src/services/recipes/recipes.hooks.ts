import * as authentication from '@feathersjs/authentication';
import { setField } from 'feathers-authentication-hooks';
import { softDelete2 } from 'feathers-hooks-common';
import FixSoftDelete404 from '../../common/fix-404';
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

export default {
  before: {
    all: [ 
      authenticate('jwt'), 
      softDelete2()
    ],
    find: [filterByOwnerId],
    get: [filterByOwnerId],
    create: [setOwnerInBody],
    update: [filterByOwnerId],
    patch: [filterByOwnerId],
    remove: [filterByOwnerId]
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
