import Category from '../models/Category.js';

const VALID_CATEGORY_VALUES = ['men', 'women', 'saree', 'watches', 'lens', 'accessories', 'shoes', 'watch'];

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    // No auto-seeding: if user deletes all categories, they stay deleted.

    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, value, subcategories = [] } = req.body;
    
    if (!name || !value) {
      return res.status(400).json({
        success: false,
        message: 'Name and value are required',
      });
    }

    const slug = value.trim().toLowerCase().replace(/\s+/g, '-');

    const exists = await Category.findOne({ value: slug });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Category with this value already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      value: slug,
      subcategories: Array.isArray(subcategories) ? subcategories.map(s => ({
        name: (s.name || s).trim(),
        value: (s.value || s).toString().trim().toLowerCase().replace(/\s+/g, '-'),
      })) : [],
      order: await Category.countDocuments(),
    });

    res.status(201).json({
      success: true,
      message: 'Category created',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, value, subcategories, order } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name) category.name = name.trim();
    if (value !== undefined) {
      const slug = value.trim().toLowerCase().replace(/\s+/g, '-');
      const exists = await Category.findOne({ value: slug, _id: { $ne: req.params.id } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Category value already in use',
        });
      }
      category.value = slug;
    }
    if (order !== undefined) category.order = order;
    if (Array.isArray(subcategories)) {
      category.subcategories = subcategories.map(s => ({
        _id: s._id,
        name: (s.name || s).trim(),
        value: (s.value || s).toString().trim().toLowerCase().replace(/\s+/g, '-'),
      }));
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};

export const addSubcategory = async (req, res) => {
  try {
    const { name, value } = req.body;
    
    if (!name || !value) {
      return res.status(400).json({
        success: false,
        message: 'Name and value are required',
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const slug = value.trim().toLowerCase().replace(/\s+/g, '-');
    const exists = category.subcategories.some(s => s.value === slug);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory already exists',
      });
    }

    category.subcategories.push({ name: name.trim(), value: slug });
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory added',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding subcategory',
      error: error.message,
    });
  }
};

export const removeSubcategory = async (req, res) => {
  try {
    const { subId } = req.params;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.subcategories = category.subcategories.filter(
      s => s._id.toString() !== subId
    );
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Subcategory removed',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing subcategory',
      error: error.message,
    });
  }
};
