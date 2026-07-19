const userRepositoryInt = (repository) => {

    const getAllScams = () => repository.getAllScams();
    const getScamById = (id) => repository.getScamById(id);
    const getScamUpdates = (since) => repository.getScamUpdates(since);
    const saveDeviceToken = (deviceToken, platform) => repository.saveDeviceToken(deviceToken, platform);
    const findDomainReputation = (hostname, rootDomain) =>
        repository.findDomainReputation(hostname, rootDomain);

    return {
        getAllScams,
        getScamById,
        getScamUpdates,
        saveDeviceToken,
        findDomainReputation
    };
};

export default userRepositoryInt;
