const adminRepositoryInt = (repository) => {
  // Admin functions
  const adminExist = (email, password) => repository.adminExist(email, password);

  // Scam functions
  const createnewScam = (data) => repository.createnewScam(data);
  const editScam = (id, data) => repository.editScam(id, data);
  const deleteScam = (id) => repository.deleteScam(id);
  const getAllScams = () => repository.getAllScams();
  const getScamById = (id) => repository.getScamById(id);
  const getAllDeviceTokens = () => repository.getAllDeviceTokens();
  const removeDeviceTokens = (tokens) => repository.removeDeviceTokens(tokens);
  const createNotificationCampaign = (campaign) => repository.createNotificationCampaign(campaign);
  const getNotificationCampaigns = () => repository.getNotificationCampaigns();

  return {
    adminExist,
    createnewScam,
    editScam,
    deleteScam,
    getAllScams,
    getScamById,
    getAllDeviceTokens,
    removeDeviceTokens,
    createNotificationCampaign,
    getNotificationCampaigns
  };
};

export default adminRepositoryInt;
