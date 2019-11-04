import * as feathersAuthentication from '@feathersjs/authentication';
import { setField } from 'feathers-authentication-hooks';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;

const filterCurrentUser = setField({
  from: 'params.user._id',
  as: 'params.query._id'
});

export default {
  before: {
    all: [  ],
    find: [ authenticate('jwt'), filterCurrentUser ],
    get: [ authenticate('jwt'), filterCurrentUser ],
    create: [  ],
    update: [  authenticate('jwt'), filterCurrentUser ],
    patch: [  authenticate('jwt'), filterCurrentUser ],
    remove: [ authenticate('jwt'), filterCurrentUser ]
  },

  after: {
    all: [ ],
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
    remove: []
  }
};
