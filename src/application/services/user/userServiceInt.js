

const userServiceInt = (repository) => {

    const generateAccessToken = (user) => repository.generateAccessToken(user);
    const generatRefreshToken=(userId)=>repository.generatRefreshToken(userId)
    const bcryptpassword=(password)=>repository.bcryptpassword(password)
    const comparePassword=(password,hashPassword)=>repository.comparePassword(password,hashPassword)
    const verifyAccessToken=(token)=>repository.verifyAccessToken(token)
    const verifyRefreshToken=(token)=>repository.verifyRefreshToken(token)
    const checkUrlSafety=(url)=>repository.checkUrlSafety(url)


  return {
    generateAccessToken,
    generatRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    bcryptpassword,
    comparePassword,
    checkUrlSafety,
    

  }
}

export default userServiceInt
