import { iff } from 'feathers-hooks-common';
import { HookContext, Hook } from '@feathersjs/feathers';
import parse from 'coercion';

export function ifApiIsNotPublic(...hooks: Hook[]) {
    return iff(
        (context: HookContext<any>) => {
            let val = parse.boolean(context.app.get('insecure'));
            return !val;
        }, ...hooks);
}