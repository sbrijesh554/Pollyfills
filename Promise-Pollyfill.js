//pollyfill for promise


function executeCallback(callback,interval,args){
    if(typeof callback !== 'undefined'){
        callback.call(null,args);
    }
    cancelInterval(interval);
}

// Check to determine wheather browser JS engine supports es6 Promise
//if (typeof window.Promise === 'undefined') {
    window.Promise = function(fn) {
        this.state = {
            "Pending": 0,
            "Resolved": 1,
            "Rejected": 2,
            "Error":3
        }
        this.currentState = this.state.Pending;
        this.fn = fn;
        this.waitingResolveOrReject = null;
        this.waitingForCatch = null;
        const context = this;
        this.resolve = function (args) {
            context.currentState = context.state.Resolved;
            context.args = args;
        }
        this.reject = function (args) {
            context.currentState = context.state.Rejected;
            context.args = args;
        }
        this.then = function (successCallback,errorCallback) {
            this.fn(this.resolve, this.reject);
            this.waitingResolveOrReject = setInterval(() => {
                if (this.currentState === 1) {
                    executeCallback.call(null,successCallback,this.waitingResolveOrReject,this.args);
                    this.currentState = 4;
                }
                if (this.currentState === 2) {
                    executeCallback.call(null,errorCallback,this.waitingResolveOrReject,this.args);
                    this.currentState = 4;
                }
            }, 0);
            return this;
        }
        this.catch = function (catchCallback) {
            this.waitingForCatch = setInterval(() => {
                if (this.currentState === 3) {
                    executeCallback.call(null,catchCallback,this.waitingForCatch,this.args);
                    this.currentState = 4;
                }
            }, 0);
            return this;
        }
        this.finally = function (finallyCallback){
            if(finallyCallback){
                this.waitingForFinally = setInterval(() => {
                    if (this.currentState === 4) {
                        executeCallback.call(null,finallyCallback,this.waitingForFinally,this.args);
                        //cleanup
                        executeCallback.call(null,undefined,this.waitingForCatch);
                        this.currentState = 0;
                    }
                }, 0);
            }
        }
    }
//}

/**
 * Below is an example consuming above pollyfill
 * a settime is used for async operation
 * calling respective resolve & reject scenarios 
 */

console.clear();
var samplePromise = new Promise((resolve, reject) => {
    //side effects invoking resolve/reject
    setTimeout(function () {
        if (true) {
            resolve("Fullfilled");
        }
    }, 2000);
});

samplePromise.then((successResponse) => {
    console.log(successResponse);
},(errorResponse)=>{
    console.log(errorResponse);
}).catch((error) => {
    console.log(error);
}).finally(()=>{
    console.log("Finally its over...");
})