import {Module} from "./Module";

export class Engine<TContext extends Record<any, any>> {

    private modules: Map<string, Module<TContext>> = new Map();

    constructor(readonly context: TContext) {

    }

    registerModule(...modules: Array<Module<TContext>>): this {
        for (const module of modules) {
            if (this.hasModule(module)) {
                throw new Error(`Module "${module.name}" is already registered`);
            }

            module.init();
            this.modules.set(module.name, module);
        }
        return this;
    }

    hasModule(module: Module<TContext> | string) {
        if (module instanceof Module) {
            return this.modules.has(module.name);
        }
        return this.modules.has(module);
    }

    runAction(name: string) {
        return Promise.all(
            Array.from(this.modules.values())
                .filter(x => x.hasAction(name))
                .map(x => x.runAction(name, this.context))
        )
            .then(x => {
                return;
            })
    }
}