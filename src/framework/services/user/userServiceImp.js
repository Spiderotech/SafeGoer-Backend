import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';
import bcrypt from 'bcrypt';
import axios from 'axios';

const userServiceImp = () => {

  

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


    const checkUrlSafety = async (url) => {
    const apiKey = 'AIzaSyCL2G273hdbLt_p_a03U7ejfYZg_uWhU8c';

    const body = {
      client: {
        clientId: "your-app-name",
        clientVersion: "1.0.0",
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    };

    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      body
    );
    console.log(response.data," response from Google Safe Browsing API");
    

    if (response.data && response.data.matches) {
      return {
        safe: false,
        threats: response.data.matches.map((m) => m.threatType),
      };
    } else {
      return { safe: true, message: "This URL is safe" };
    }
  };


  return {

    bcryptpassword,
    comparePassword,
    generateAccessToken,
    generatRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    checkUrlSafety

  }
}

export default userServiceImp
