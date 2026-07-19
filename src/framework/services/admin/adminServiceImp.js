import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';
import bcrypt from 'bcrypt';

const adminServiceImp = () => {

  

    const bcryptpassword= async(password)=>{
        const salt=await bcrypt.genSalt(10);
        const hashpassword=await bcrypt.hash(password,salt);
        return hashpassword

    }
    
    const comparePassword = (password, hashPassword) => bcrypt.compare(password, hashPassword);
    const generateAccessToken=(user)=>jwt.sign({user},config.ACCESS_TOKEN_SECRET,{expiresIn:'25m'})
    const generatRefreshToken=(user)=>jwt.sign({user},config.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
    const verifyAccessToken = (token) => jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    const verifyRefreshToken=(token)=>jwt.verify(token,config.REFRESH_TOKEN_SECRET)


  return {

    bcryptpassword,
    comparePassword,
    generateAccessToken,
    generatRefreshToken,
    verifyAccessToken,
    verifyRefreshToken

  }
}

export default adminServiceImp
