import userController from "../../../../adapters/controllers/user/userController.js";
import userRepositoryImp from "../../../database/mongodb/repositories/user/userRepositoryImp.js";
import userRepositoryInt from "../../../../application/repositories/user/userRepositoryInt.js";
import userServiceImp from "../../../services/user/userServiceImp.js";
import userServiceInt from "../../../../application/services/user/userServiceInt.js";

const userRouter=(express)=>{
   const router = express.Router();

  const controller = userController(
    userRepositoryInt,
    userRepositoryImp,
    userServiceInt,
    userServiceImp
  );


  router.route("/scams").get(controller.getAllScamsData);        // Get all scams
  router.route("/scams/updates").get(controller.getScamUpdatesData); // Delta sync for local cache
  router.route("/scams/:id").get(controller.getscamById); 
  router.route("/device-token").post(controller.saveDeviceToken);
  router.route("/check-url").post(controller.checkUrlSafety);
  router.route("/analyze").post(controller.analyze);
     

   

   

    return router;

}
export default userRouter ;
