import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    const navLinks = categories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
      path: cat.path,
      subItems: cat.subItems || [],
    }));
    res.status(200).json({
      success: true,
      data: { categories: navLinks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};
