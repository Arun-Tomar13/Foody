const { StatusCodes } = require("http-status-codes")
const ApiError = require("../utils/ApiError")
const { error } = require("../validation/user.validation")
const ApiResponse = require("../utils/ApiResponse")

const validate = (schema)=>{
    return (req,res,next)=>{
        try{
           
            const {value,error} = schema.validate(req.body,{abortEarly:false})
            if(error) throw error         
                
            next()
            
        }
        catch(err){
            //   res.send(err)
            // throw new ApiError(StatusCodes.BAD_REQUEST,errors)
            res.json(new ApiResponse(StatusCodes.BAD_REQUEST,err.message))
        }
    }
}   

module.exports={validate}