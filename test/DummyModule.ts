import {Module} from "@src/Module";

export class DummyModule extends Module<any> {
    constructor(name: string, actions: DummyModule.ActionDefinition[], private onInit?: () => any) {
        super(name);

        for (const definition of actions) {
            this.registerAction(definition.name, definition.action);
        }
    }

    init() {
        this.onInit && this.onInit.call(this);
    }
}

export namespace DummyModule {
    export interface ActionDefinition {
        name: string;
        action: Module.Action<any>;
    }
}