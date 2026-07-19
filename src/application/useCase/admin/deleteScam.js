const deleteScam = async (id, repositories) => {
  try {
    const product = await repositories.deleteScam(id);
    return { status: true, product };
  } catch (error) {
    console.error("Error deleting scam:", error);
    return { message: "Error deleting scam", status: false };
  }
};

export default deleteScam;
