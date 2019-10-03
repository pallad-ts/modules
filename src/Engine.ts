import {Module} from "./Module";

export class Engine<TContext> {

    private modules: Map<string, Module<TContext>> = new Map();

    registerModule(...modules: Module<TContext>[]): this {
        for (const module of modules) {
            if (this.hasModule(module)) {
                throw new Error(`Module "${module.name}" is already registered`);
            }

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
}