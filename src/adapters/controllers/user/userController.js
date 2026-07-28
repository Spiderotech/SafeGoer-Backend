import getAllScams from "../../../application/useCase/user/getAllScams.js";
import getScamById from "../../../application/useCase/user/getScamById.js";
import getScamUpdates from "../../../application/useCase/user/getScamUpdates.js";
import savedeviceToken from "../../../application/useCase/user/savedeviceToken.js";
import checkurlSafety from "../../../application/useCase/user/checkurlSafety.js";
import analyzeContent from "../../../application/useCase/user/analyzeContent.js";

const userController = (userRepositoryInt, userRepositoryImp, userServiceInt, userServiceImp) => {
    const dbrepository = userRepositoryInt(userRepositoryImp());
    const authService = userServiceInt(userServiceImp());



    const getAllScamsData = (req, res) => {
        getAllScams(dbrepository)
            .then(response => res.json(response))
            .catch(err => console.log(err));
    };

    const getScamUpdatesData = (req, res) => {
        const { since } = req.query;
        getScamUpdates(since, dbrepository)
            .then(response => res.json(response))
            .catch(err => console.log(err));
    };

    // Get scam by ID
    const getscamById = (req, res) => {
        const { id } = req.params;
        getScamById(id, dbrepository)
            .then(response => res.json(response))
            .catch(err => console.log(err));
    };

    const saveDeviceToken = (req, res) => {
        const { deviceToken, token, platform } = req.body;
        console.log("Registering device token:", {
            hasToken: Boolean(deviceToken || token),
            platform
        });
        savedeviceToken(deviceToken || token, platform, dbrepository)
            .then(response => res.json(response))
            .catch(err => console.log(err));
    };
    const checkUrlSafety = async (req, res) => {
        try {
            const { url } = req.body;
            console.log("Checking URL safety:", url);
            
            if (!url) {
                return res.status(400).json({ message: "URL is required" });
            }

            const result = await checkurlSafety(url, authService);
            return res.status(200).json(result);
        } catch (error) {
            console.error("URL Check Error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    const analyze = async (req, res) => {
        try {
            const { type, value } = req.body;

            if (!type || !value) {
                return res.status(400).json({
                    status: false,
                    message: "type and value are required"
                });
            }

            const result = await analyzeContent({ type, value }, dbrepository, authService);
            return res.status(result.status ? 200 : 400).json(result);
        } catch (error) {
            console.error("Analyze Error:", error);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    };



    return {

        getAllScamsData,
        getScamUpdatesData,
        getscamById,
        saveDeviceToken,
        checkUrlSafety,
        analyze

    };
};

export default userController;
