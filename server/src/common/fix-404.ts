import { HookContext, Hook } from "@feathersjs/feathers";
import { checkContext } from "feathers-hooks-common";

export default function (_options: any = {}): Hook {
    return function FixSoftDelete404(ctx:HookContext<any>)
    {
        checkContext(ctx, 'error', 'remove');

        if(ctx.error && ctx.error.code == 404)
        {
            delete ctx.error;
            ctx.result = {message: 'ok'}
            ctx.statusCode = 200;
            return ctx;
        }
    }
};