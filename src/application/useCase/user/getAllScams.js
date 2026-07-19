const getAllScams = async (repositories) => {
  try {
    const product = await repositories.getAllScams();
    console.log("Fetched scams:", product);
    
    return { status: true, product };
  } catch (error) {
    console.error("Error fetching scams:", error);
    return { message: "Error fetching scams", status: false };
  }
};

export default getAllScams;
