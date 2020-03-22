/**
 * Pollyfil for new operator
 * @param {*} fn function to be used as constructor
 * @param {*} args supporting arguments
 */

function newOperator(fn, ...args) {
    var context = Object.create(fn.prototype);
    var result = fn.call(context, ...args);
    if (typeof result === 'object' && result !== null) {
        return result;
    }
    return context;
}

//demo code
function Person(name, age){
this.name = name;
this.age = age;
}

var p = newOperator(Person,"Brijesh",31);

console.log(p);