import {Engine} from "@src/Engine";
import {DummyModule} from "./DummyModule";
import * as sinon from 'sinon';

describe('Engine', () => {
    let engine: Engine<typeof CONTEXT>;

    const ACTION_NAME1 = 'action-name1';
    const ACTION_NAME2 = 'action-name2';
    const ACTION_NAME3 = 'action-name3';

    let onInit1: sinon.SinonStub;
    let onInit2: sinon.SinonStub;

    let module1: DummyModule;
    let module2: DummyModule;

    let module1Actions: DummyModule.ActionDefinition[];
    let module2Actions: DummyModule.ActionDefinition[];

    const CONTEXT = {
        foo: 'bar'
    };

    beforeEach(() => {

        onInit1 = sinon.stub();
        onInit2 = sinon.stub();

        module1Actions = [
            {name: ACTION_NAME1, action: sinon.stub().resolves('a1')},
            {name: ACTION_NAME2, action: sinon.stub().returns('a2')}
        ];
        module2Actions = [
            {name: ACTION_NAME2, action: sinon.stub().resolves('b1')},
            {name: ACTION_NAME3, action: sinon.stub().returns('b2')}
        ];

        module1 = new DummyModule('module1', module1Actions, onInit1);
        module2 = new DummyModule('module2', module2Actions, onInit2);
        engine = new Engine(CONTEXT);

        engine.registerModule(module1, module2);
    });

    describe('Checking whether module exists', () => {
        it('existing', () => {
            expect(engine.hasModule(module1.name))
                .toBe(true);

            expect(engine.hasModule(module2.name))
                .toBe(true);
        });

        it('not existing', () => {
            expect(engine.hasModule('foo'))
                .toBe(false);
        });
    });

    describe('registering module', () => {
        it('success - calls init on registration', () => {
            const engine = new Engine(CONTEXT);
            const actions: DummyModule.ActionDefinition[] = [
                {name: 'action1', action: sinon.stub()},
                {name: 'action2', action: sinon.stub()}
            ];
            const onInit = sinon.stub();
            const module = new DummyModule('foo', actions, onInit);

            sinon.assert.notCalled(onInit);
            engine.registerModule(module);

            sinon.assert.calledOnce(onInit);
        });

        it('fails if module with the same ref exists', () => {
            const engine = new Engine(CONTEXT);
            const module1 = new DummyModule('foo', []);
            const module2 = new DummyModule('foo', []);

            engine.registerModule(module1);

            expect(() => {
                engine.registerModule(module2)
            })
                .toThrowErrorMatchingSnapshot();
        });
    });

    describe('calling action', () => {
        it('nothing gets called if action is not defined in any of registered modules', async () => {
            await engine.runAction('foo');

            sinon.assert.notCalled(module1Actions[0].action as any);
            sinon.assert.notCalled(module1Actions[1].action as any);

            sinon.assert.notCalled(module2Actions[0].action as any);
            sinon.assert.notCalled(module2Actions[1].action as any);
        });

        it('calling action1', async () => {
            await engine.runAction(ACTION_NAME1);

            sinon.assert.calledWith(module1Actions[0].action as any, sinon.match.same(CONTEXT));
            sinon.assert.notCalled(module1Actions[1].action as any);

            sinon.assert.notCalled(module2Actions[0].action as any);
            sinon.assert.notCalled(module2Actions[1].action as any);
        });

        it('calling action2', async () => {
            await engine.runAction(ACTION_NAME2);

            sinon.assert.notCalled(module1Actions[0].action as any);
            sinon.assert.calledWith(module1Actions[1].action as any, sinon.match.same(CONTEXT));

            sinon.assert.calledWith(module2Actions[0].action as any, sinon.match.same(CONTEXT));
            sinon.assert.notCalled(module2Actions[1].action as any);
        });
    })
});