const Content = require("../models/Content");
const fs = require("fs");
const path = require("path");

class ContentService {

  async getRegionStructured(regionId) {
    const results = await Content.findAll({
      where: { region: regionId },
      order: [["createdAt", "DESC"]],
    });

    const structured = {
      name: "",
      description: "",
      heritageSites: [],
      intangibleHeritage: {
        oral: [],
        folklore: [],
        crafts: []
      },
      clothing: {
        men: [],
        women: [],
        boys: [],
        girls: []
      },
      food: []
    };

    results.forEach(item => {
      const entry = {
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image
          ? `${item.image}`
          : null,
        model3d: item.model3d || null,
      googlemapsurl: item.googlemapsurl || null,
      coordinates:item.coordinates|| null,
      votesCount : item.votesCount
        
      };

      switch (item.type) {

        /** Heritage Sites */
        case "heritage":
          structured.heritageSites.push(entry);
          break;

        /** Intangible Heritage */
        case "intangible-oral":
          structured.intangibleHeritage.oral.push(entry);
          break;

        case "intangible-folklore":
          structured.intangibleHeritage.folklore.push(entry);
          break;

        case "intangible-crafts":
          structured.intangibleHeritage.crafts.push(entry);
          break;

        /** Clothing */
        case "clothing-men":
          structured.clothing.men.push(entry);
          break;

        case "clothing-women":
          structured.clothing.women.push(entry);
          break;

        case "clothing-boys":
          structured.clothing.boys.push(entry);
          break;

        case "clothing-girls":
          structured.clothing.girls.push(entry);
          break;

        /** Food */
        case "food":
          structured.food.push(entry);
          break;
      }
    });

    return structured;
  }


  async getContentById(id) {
    const content = await Content.findByPk(id);
    if (!content) throw new Error("Content not found");
    return content;
  }
    async getAllContents() {
    const content = await Content.findAll();
    if (!content) throw new Error("Content not found");
    return content;
  }

  async createContent(data) {
    const newContent = await Content.create({
      title: data.title,
      description: data.description,
      type: data.type,
      region: data.region,
      image: data.image || null,
      model3d: data.model3d || null,
      googlemapsurl: data.googlemapsurl || null,
      coordinates:data.coordinates|| null ,
      votesCount : 0
    });
    return newContent;
  }

  async updateContent(id, data) {
    const content = await this.getContentById(id);

    if (data.image && content.image) {
      this.deleteImageFile(content.image);
    }

    const updated = await content.update({
      title: data.title ?? content.title,
      description: data.description ?? content.description,
      type: data.type ?? content.type,
      region: data.region ?? content.region,
      image: data.image ?? content.image,
      model3d: data.model3d || null,
      googlemapsurl: data.googlemapsurl || null,
      coordinates:data.coordinates|| null
    });

    return updated;
  }

  async deleteContent(id) {
    const content = await this.getContentById(id);

    if (content.image) this.deleteImageFile(content.image);

    await content.destroy();
    return { message: "Deleted successfully" };
  }

  deleteImageFile(filename) {
    const filePath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

module.exports = new ContentService();
