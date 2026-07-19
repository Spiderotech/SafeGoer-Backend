
import adminRouter from "./admin/admin.js"
import commonservice from "./commonservice.js"
import userRouter from "./user/user.js"

const  routes=( app,express)=>{

    app.use('/api/v1/service',commonservice(express))
    app.use('/api/v1/admin',adminRouter(express))
    app.use('/api/v1/user',userRouter(express))

    
    

}
export default routes