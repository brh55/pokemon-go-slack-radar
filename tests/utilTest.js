var utilTest = require('nodeunit').testCase;
var util = require('../libs/customUtils');

var undefMockObj = {
    testProp1: undefined,
    testProp2: true,
    testProp3: false,
    testProp5: undefined,
    testProp6: undefined,
    testProp7: undefined
};

var defMockObj = {
    testProp: 'randomstring',
    testPropFun: function () {
        return;
    },
    testProp2: 'moreString'
};

module.exports = utilTest({
    allDefined: function (test) {
        var expectFalse = util.allDefined(undefMockObj);
        var expectTrue = util.allDefined(defMockObj);

        test.equal(expectFalse, false);
        test.equal(expectTrue, true);
        test.done();
    },
    getUndefinedKeys: function (test) {
        var testList = util.getUndefinedKeys(undefMockObj, '+');

        test.equal(testList, 'testProp1+testProp5+testProp6+testProp7');
        test.done();
    }
});
