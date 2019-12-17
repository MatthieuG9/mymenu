import * as feathersAuthentication from '@feathersjs/authentication';
import { setField } from 'feathers-authentication-hooks';
import { ifApiIsNotPublic } from '../../common/hook';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;

const filterCurrentUser = setField({
  from: 'params.user._id',
  as: 'params.query._id'
});

const hookAuthenticateFilter = [
  ifApiIsNotPublic(authenticate('jwt'), filterCurrentUser)
]

export default {
  before: {
    all: [],
    find: hookAuthenticateFilter,
    get: hookAuthenticateFilter,
    create: [],
    update: hookAuthenticateFilter,
    patch: hookAuthenticateFilter,
    remove: hookAuthenticateFilter
  },

  after: {
    all: [],
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
