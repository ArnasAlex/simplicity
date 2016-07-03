var TO = require('../../../../backend/operation/testOperation');
describe('Testing operation', function () {
    it('should fail test', function () {
        expect(4).toEqual(4);
        expect(33).toEqual(44);
    });
    it('should execute test', function () {
        expect(4).toEqual(4);
        expect(33).toEqual(33);
    });
    xit('should skip test', function () {
        expect(4).toEqual(4);
        expect(33).toEqual(33);
    });
    it('should test opration', function () {
        var op = new TO.TestOperation();
        var result = op.addNumbers(5, 3);
        expect(result).toEqual(8);
    });
});
//# sourceMappingURL=testOperation.spec.js.map