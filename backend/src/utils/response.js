const sendResponse = ({res,statusCode,message,data=[],success=true})=>{
    
    return res
    .status(200)
    .json({
        success,
        statusCode,
        message,
        data,
    })
}


module.exports = sendResponse