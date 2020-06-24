import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    // in the js world abstract classes gets translated into objects and can be used to check instanceof. 
    statusCode = 400;
    
    constructor(public message: string) {
        super(message);
        //typescript specific when extending built-in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return  [{message: this.message}];
    }
}