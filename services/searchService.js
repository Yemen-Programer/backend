const Content  = require('../models/Content');
const { Op } = require('sequelize');

class SearchService {
  async searchContent(query) {
    try {
      const results = await Content.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
          ]
        },
        attributes: [
          'id', 'title', 'description', 'type', 'region', 
          'image', 'coordinates', 'googlemapsurl', 'createdAt'
        ],
        order: [['createdAt', 'DESC']],
        limit: 20
      });

      return {
        success: true,
        data: results,
        count: results.length
      };
    } catch (error) {
      throw new Error(`Search service error: ${error.message}`);
    }
  }

  async getSearchSuggestions(query) {
    try {
      const suggestions = await Content.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
          ]
        },
        attributes: ['title'],
        group: ['title'],
        limit: 5
      });

      return suggestions.map(item => item.title);
    } catch (error) {
      throw new Error(`Suggestions service error: ${error.message}`);
    }
  }
}

module.exports = new SearchService();