class CustomError extends Error{
    constructor(code,message){
        super(message);
        this.code=code;
    }
}

class ValidationError extends CustomError{
    constructor(message){
        super(400,message||"Validation Failed!");
    }
}

module.exports={
    CustomError,
    ValidationError
}