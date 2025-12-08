const ContentService = require("../services/ContentService");
const { validationResult } = require("express-validator");

class ContentController {

  /** GET /contents */
  async getContent(req, res) {
    try {
      const data = await ContentService.getAllContents();
      return res.status(200).json({ success: true, data });

    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  /** GET /contents/region/:region */
  async getRegionContent(req, res) {
    try {
      const region = req.params.region;
      const data = await ContentService.getRegionStructured(region);

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /** GET /contents/:id */
  async getContentById(req, res) {
    try {
      const { id } = req.params;
      const data = await ContentService.getContentById(id);
      return res.status(200).json({ success: true, data });

    } catch (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
  }

  /** POST /contents */
  async createContent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      // معالجة الملفات المرسلة
      let imageFile = null;
      let model3dFile = null;

      if (req.files) {
        // إذا كانت الملفات مرسلة كـ array (upload.any())
        if (Array.isArray(req.files)) {
          req.files.forEach(file => {
            const ext = file.originalname.toLowerCase().split('.').pop();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
              imageFile = file.filename;
            } else if (['obj', 'glb', 'gltf', 'fbx', 'stl'].includes(ext)) {
              model3dFile = file.filename;
            }
          });
        } 
        // إذا كانت الملفات مرسلة كـ object (upload.fields())
        else {
          if (req.files.image) {
            imageFile = req.files.image[0].filename;
          }
          if (req.files.model3d) {
            model3dFile = req.files.model3d[0].filename;
          }
        }
      }

      // إذا كان النوع ملابس، لا نسمح بالصور (نضعها null)
      const isClothingType = req.body.type && req.body.type.startsWith('clothing-');
      if (isClothingType) {
        imageFile = null; // إخفاء الصور للملابس
      }

      const body = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        region: req.body.region,
        image: imageFile,
        model3d: model3dFile,
        googlemapsurl: req.body.googlemapsurl || null,
        coordinates: req.body.coordinates || null
      };

      console.log('بيانات الإنشاء:', body);

      const newItem = await ContentService.createContent(body);

      return res.status(201).json({ success: true, data: newItem });

    } catch (err) {
      console.error('خطأ في إنشاء المحتوى:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  /** PUT /contents/:id */
  async updateContent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      // معالجة الملفات المرسلة
      let imageFile = undefined;
      let model3dFile = undefined;

      if (req.files) {
        if (Array.isArray(req.files)) {
          req.files.forEach(file => {
            const ext = file.originalname.toLowerCase().split('.').pop();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
              imageFile = file.filename;
            } else if (['obj', 'glb', 'gltf', 'fbx', 'stl'].includes(ext)) {
              model3dFile = file.filename;
            }
          });
        } else {
          if (req.files.image) {
            imageFile = req.files.image[0].filename;
          }
          if (req.files.model3d) {
            model3dFile = req.files.model3d[0].filename;
          }
        }
      }

      // إذا كان النوع ملابس، لا نسمح بالصور
      const isClothingType = req.body.type && req.body.type.startsWith('clothing-');
      if (isClothingType && imageFile) {
        imageFile = null; // إخفاء الصور للملابس
      }

      const body = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        region: req.body.region,
        googlemapsurl: req.body.googlemapsurl,
        coordinates: req.body.coordinates
      };

      // إضافة الملفات فقط إذا تم رفعها
      if (imageFile !== undefined) body.image = imageFile;
      if (model3dFile !== undefined) body.model3d = model3dFile;

      console.log('بيانات التحديث:', body);

      const updated = await ContentService.updateContent(req.params.id, body);

      return res.status(200).json({ success: true, data: updated });

    } catch (err) {
      console.error('خطأ في تحديث المحتوى:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  /** DELETE /contents/:id */
  async deleteContent(req, res) {
    try {
      const result = await ContentService.deleteContent(req.params.id);
      return res.status(200).json({ success: true, message: result.message });

    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ContentController();