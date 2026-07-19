import commonserviceController from "../../../adapters/controllers/commonserviceController.js";


const commonservice=(express)=>{
    const router=express.Router()
    const controller=commonserviceController()
    router.route('/s3service').get(controller.s3service)

    return router

   

}
export default commonservice ;