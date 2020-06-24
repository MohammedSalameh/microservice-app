export abstract class CustomError extends Error {
    // in the js world abstract classes gets translated into objects and can be used to check instanceof. 
    abstract statusCode: number;
    
    constructor(message: string) {
        super(message);

        //typescript specific when extending built-in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string; field?: string}[];
}