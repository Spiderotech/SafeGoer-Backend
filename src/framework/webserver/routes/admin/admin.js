import adminController from "../../../../adapters/controllers/admin/adminController.js";
import adminRepositoryImp from "../../../database/mongodb/repositories/admin/adminRepositoryImp.js";
import adminRepositoryInt from "../../../../application/repositories/admin/adminRepositoryInt.js";
import adminServiceImp from "../../../services/admin/adminServiceImp.js";
import adminServiceInt from "../../../../application/services/admin/adminServiceInt.js";

const adminRouter = (express) => {
  const router = express.Router();

  const controller = adminController(
    adminRepositoryInt,
    adminRepositoryImp,
    adminServiceInt,
    adminServiceImp
  );

  // Admin login
  router.route("/login").post(controller.adminLogin);

  // Scam CRUD routes
  router.route("/scams").post(controller.addScamData);        // Create new scam
  router.route("/scams").get(controller.getAllScamsData);        // Get all scams
  router.route("/scams/:id").get(controller.getscamById);    // Get single scam
  router.route("/scams/:id").put(controller.editScamData);   // Edit scam
  router.route("/scams/:id").delete(controller.deleteScamData); // Delete scam

  // Notification management
  router.route("/notifications/send").post(controller.sendNotification);
  router.route("/notifications/schedule").post(controller.scheduleNotification);
  router.route("/notifications").get(controller.getNotificationHistory);

  return router;
};

export default adminRouter;
