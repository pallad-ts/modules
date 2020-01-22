import {Module} from "./Module";

export class Engine<TContext extends Record<any, any>> {

    private modules: Map<string, Module<TContext>> = new Map();

    constructor(readonly context: TContext) {

    }

    registerModule(...modules: Array<Module<TContext>>): this {
        for (const module of modules) {
            if (this.hasModule(module.name)) {
                throw new Error(`Module "${module.name}" is already registered`);
            }

            module.init();
            this.modules.set(module.name, module);
        }
        return this;
    }

    hasModule(moduleName: string) {
        return this.modules.has(moduleName);
    }

    runAction(actionName: string) {
        return Promise.all(
            Array.from(this.modules.values())
                .filter(x => x.hasAction(actionName))
                .map(x => x.runAction(actionName, this.context))
        )
            .then(x => {
                return;
            })
    }
}