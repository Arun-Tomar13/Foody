const fs = require('fs')
const path = require('path')
const cron = require('node-cron');

const fileCleanup = ()=>{
cron.schedule('0 0 * * *', () => {
  
  try {
    const directory = path.join('public','exports')
    
    const files = fs.readdirSync(directory)
    
    if(files.length>0){
      files.map((fileName)=>{
        fs.unlink(`${directory}/${fileName}`,(err)=>{
          if(err) console.log(err);
        })
      })
      console.log("files removed succesfuly",files);
    }
    
  } catch (error) {
    console.log("error while cleanup, error",error.message);
  }
  
});
}

module.exports = {fileCleanup}