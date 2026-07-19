const getScamById = async (id, repositories) => {
  try {
    const product = await repositories.getScamById(id);
    return { status: true, product };
  } catch (error) {
    console.error("Error fetching scam:", error);
    return { message: "Error fetching scam", status: false };
  }
};

export default getScamById;
