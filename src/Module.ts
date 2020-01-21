export class Module<TContext = Record<any, any>> {

    private actions: Map<string, Module.Action<TContext>> = new Map();

    constructor(readonly name: string) {

    }

    // tslint:disable-next-line:no-empty
    init() {

    }

    protected registerAction(name: string, action: Module.Action<TContext>): this {
        if (this.hasAction(name)) {
            throw new Error(`Action "${name}" is already registered`);
        }
        this.actions.set(name, action);
        return this;
    }

    public hasAction(name: string) {
        return this.actions.has(name);
    }

    public runAction(name: string, context: TContext) {
        return this.actions.get(name)!(context);
    }
}

export namespace Module {
    export type Action<TContext> = (context: TContext) => Promise<void> | void;
}