import fileUpload from "../../application/useCase/commonservice/FileuploadingUrl.js"

const commonserviceController = () => {
    const s3service=(req,res)=>{
        fileUpload(req.query.contentType).then((response)=>{
            
            res.json({response})
            

        }).catch((error)=>{
            console.error("S3 upload URL error:", error);
            res.status(500).json({status:false,message:"Unable to create upload URL"});
        })
    }


  return {
    s3service

  }
}

export default commonserviceController
