const Content  = require('../models/Content');
const { Op } = require('sequelize');

exports.searchContent = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال نص للبحث'
      });
    }

    const searchResults = await Content.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`
            }
          },
          {
            description: {
              [Op.like]: `%${query}%`
            }
          }
        ]
      },
      attributes: [
        'id',
        'title',
        'description',
        'type',
        'region',
        'image',
        'coordinates',
        'googlemapsurl'
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    // تحسين النتائج بإضافة جزء من النص الذي ظهر فيه البحث
    const enhancedResults = searchResults.map(item => {
      const itemData = item.toJSON();
      
      // البحث عن النص في العنوان والوصف
      let highlightedText = '';
      const searchQuery = query.toLowerCase();
      
      if (itemData.title.toLowerCase().includes(searchQuery)) {
        const index = itemData.title.toLowerCase().indexOf(searchQuery);
        highlightedText = itemData.title.substring(Math.max(0, index - 20), 
          Math.min(itemData.title.length, index + searchQuery.length + 50));
      } else if (itemData.description.toLowerCase().includes(searchQuery)) {
        const index = itemData.description.toLowerCase().indexOf(searchQuery);
        highlightedText = itemData.description.substring(Math.max(0, index - 20), 
          Math.min(itemData.description.length, index + searchQuery.length + 50));
      }

      return {
        ...itemData,
        highlightedText: highlightedText || itemData.description.substring(0, 100) + '...',
        regionArabic: getRegionArabicName(itemData.region)
      };
    });

    res.json({
      success: true,
      data: enhancedResults,
      count: enhancedResults.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في البحث'
    });
  }
};

// دالة لتحويل اسم المنطقة للإنجليزية
function getRegionArabicName(region) {
  const regions = {
    'northern': 'المنطقة الشمالية',
    'eastern': 'المنطقة الشرقية',
    'central': 'المنطقة الوسطى',
    'western': 'المنطقة الغربية',
    'southern': 'المنطقة الجنوبية'
  };
  return regions[region] || region;
}