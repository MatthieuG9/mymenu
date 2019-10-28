import assert from 'assert';
import app from '../../src/app';

describe('\'Ingredients\' service', () => {
  it('registered the service', () => {
    const service = app.service('ingredients');

    assert.ok(service, 'Registered the service');
  });
});
