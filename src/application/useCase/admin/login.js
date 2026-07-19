const login = async (email, password, repositories, authService) => {

    const isEmail = await repositories.adminExist(email, password);
    console.log(isEmail, "kkk");

    if (isEmail !== null && isEmail.email !== null && isEmail.password) {
        const isPassword = await authService.comparePassword(password, isEmail.password);
        console.log(isPassword, "poooooo");
        
        if (isPassword) {
            const isAdmin = {
                adminId: isEmail._id,
                adminEmail: isEmail.email,
            };
            
            const AccessToken = await authService.generateAccessToken(isAdmin);
            const RefreshToken = await authService.generatRefreshToken(isAdmin);

            console.log(AccessToken, RefreshToken, isAdmin);

            return { status: true, isAdmin, AccessToken, RefreshToken };
        } else {
            return { status: false, message: 'Invalid password' };
        }
    } else if (isEmail === null) {
        return { message: 'Invalid email or password', status: false };
    } else {
        return { message: 'Invalid email or password', status: false };
    }
};

export default login;
