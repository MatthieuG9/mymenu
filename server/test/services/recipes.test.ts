import assert from 'assert';
import app from '../../src/app';

describe('\'Recipes\' service', () => {
  it('registered the service', () => {
    const service = app.service('recipes');

    assert.ok(service, 'Registered the service');
  });
});
