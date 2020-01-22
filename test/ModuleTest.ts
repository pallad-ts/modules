import {DummyModule} from "./DummyModule";
import * as sinon from 'sinon';

describe('Module', () => {

    let module: DummyModule;
    let actions: DummyModule.ActionDefinition[];
    let onInit: sinon.SinonStub;

    const ACTION_NAME1 = 'action1';
    const ACTION_NAME2 = 'action2';
    const CONTEXT = {foo: 'bar'};

    beforeEach(() => {
        actions = [
            {name: ACTION_NAME1, action: sinon.stub()},
            {name: ACTION_NAME2, action: sinon.stub()}
        ];
        onInit = sinon.stub();
        module = new DummyModule('foo', actions, onInit);
    });

    describe('checking whether action exists', () => {
        it('exists', () => {
            expect(module.hasAction(ACTION_NAME1))
                .toBe(true);
        });

        it('does not exists', () => {
            expect(module.hasAction('some-random'))
                .toBe(false);
        });
    });

    describe('registering action', () => {
        it('fails to register action with same name', () => {
            expect(() => {
                // tslint:disable-next-line:no-unused-expression
                new DummyModule('foo', [
                    {name: 'foo', action: sinon.stub()},
                    {name: 'foo', action: sinon.stub()}
                ])
            })
                .toThrowErrorMatchingSnapshot();
        })
    });

    describe('running action', () => {
        it('calls action if exists', () => {
            module.runAction(ACTION_NAME1, CONTEXT);

            sinon.assert.calledWith(actions[0].action as any, sinon.match.same(CONTEXT));
        });

        it('throws an error if action does not exist', () => {
            expect(() => {
                module.runAction('some-random', CONTEXT);
            })
                .toThrowErrorMatchingSnapshot();
        });
    });
});
