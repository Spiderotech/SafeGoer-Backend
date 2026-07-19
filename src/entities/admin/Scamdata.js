const scamdata = (title, subtitle, description, category, subcategory, location, tags, images, details = {}) => {
  return {
    getTitle: () => title,
    getSubtitle: () => subtitle,
    getDescription: () => description,
    getCategory: () => category,
    getSubcategory: () => subcategory,
    getLocation: () => location,
    getTags: () => tags,
    getImages: () => images,
    getScamType: () => details.scamType,
    getRisk: () => details.risk,
    getBrand: () => details.brand,
    getHappening: () => details.happening,
    getWarningSigns: () => details.warningSigns,
    getActions: () => details.actions,
    getWebsite: () => details.website,
    getStatus: () => details.status,
  };
};

export default scamdata;
