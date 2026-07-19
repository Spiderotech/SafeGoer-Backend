const getScamUpdates = async (since, repositories) => {
  try {
    return await repositories.getScamUpdates(since);
  } catch (error) {
    console.error("Error in get scam updates use case:", error);
    return { status: false, message: "Error fetching scam updates" };
  }
};

export default getScamUpdates;
