import config from "../../../config/config.js";
import{S3Client,PutObjectCommand}from '@aws-sdk/client-s3';
import {getSignedUrl} from'@aws-sdk/s3-request-presigner';
import {randomBytes}from 'crypto'



const fileUpload= async(contentType = 'image/jpeg')=>{
    const region=config.S3_REGION;
    const bucketName=config.S3_BUCKET_NAME;
    const accessKeyId=config.S3_ACCESS_KEY;
    const secretAccessKey=config.S3_SECRET_KEY;

    const s3Client =new S3Client({
        region,
        credentials:{
            accessKeyId,
            secretAccessKey,
        }

    });
    const rowBytes= await randomBytes(16)
    const imageName=rowBytes.toString('hex')
    const command=new PutObjectCommand({
        Bucket:bucketName,
        Key:imageName,
        ContentType: contentType,
    })
    const uploadURL=await getSignedUrl(s3Client,command)
    const publicURL=`https://${bucketName}.s3.${region}.amazonaws.com/${imageName}`;
    return {uploadURL, publicURL};
}
export default fileUpload
