/// <reference path="../../typings/refs.d.ts" />
import TO = require('../../../../backend/operation/testOperation');

describe('Testing operation',() => {
    it('should fail test', () => {
        expect(4).toEqual(4);
        expect(33).toEqual(44);
    });

    it('should execute test',() => {
        expect(4).toEqual(4);
        expect(33).toEqual(33);
    });

    xit('should skip test',() => {
        expect(4).toEqual(4);
        expect(33).toEqual(33);
    });

    it('should test opration', () => {
        var op = new TO.TestOperation();
        var result = op.addNumbers(5, 3);
        expect(result).toEqual(8);
    });
});