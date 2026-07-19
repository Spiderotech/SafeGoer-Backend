import scamdata from "../../../entities/admin/Scamdata.js";

const editScam = async (id, title, subtitle, description, category, subcategory, location, tags, images, details, repositories) => {
  try {
    const data = scamdata(title, subtitle, description, category, subcategory, location, tags, images, details);
    const product = await repositories.editScam(id, data);
    return { status: true, product };
  } catch (error) {
    console.error("Error editing scam:", error);
    return { message: "Error editing scam", status: false };
  }
};

export default editScam;
