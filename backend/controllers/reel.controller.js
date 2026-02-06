import Reel from '../models/Reel.js';

// Get all reels (public - for home page)
export const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: { reels } });
  } catch (error) {
    console.error('Error fetching reels:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reels' });
  }
};

// Get all reels for admin (includes inactive)
export const getAdminReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: { reels } });
  } catch (error) {
    console.error('Error fetching reels:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reels' });
  }
};

// Create a new reel
export const createReel = async (req, res) => {
  try {
    const { title, videoUrl, thumbnailUrl, productLink, isActive, order } = req.body;
    
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and Video URL are required' });
    }

    const reel = new Reel({
      title,
      videoUrl,
      thumbnailUrl: thumbnailUrl || '',
      productLink: productLink || '',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await reel.save();
    res.status(201).json({ success: true, data: { reel }, message: 'Reel created successfully' });
  } catch (error) {
    console.error('Error creating reel:', error);
    res.status(500).json({ success: false, message: 'Failed to create reel' });
  }
};

// Update a reel
export const updateReel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, videoUrl, thumbnailUrl, productLink, isActive, order } = req.body;

    const reel = await Reel.findByIdAndUpdate(
      id,
      { title, videoUrl, thumbnailUrl, productLink, isActive, order },
      { new: true, runValidators: true }
    );

    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    res.json({ success: true, data: { reel }, message: 'Reel updated successfully' });
  } catch (error) {
    console.error('Error updating reel:', error);
    res.status(500).json({ success: false, message: 'Failed to update reel' });
  }
};

// Delete a reel
export const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await Reel.findByIdAndDelete(id);

    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    res.json({ success: true, message: 'Reel deleted successfully' });
  } catch (error) {
    console.error('Error deleting reel:', error);
    res.status(500).json({ success: false, message: 'Failed to delete reel' });
  }
};

// Toggle reel active status
export const toggleReelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await Reel.findById(id);

    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    reel.isActive = !reel.isActive;
    await reel.save();

    res.json({ success: true, data: { reel }, message: `Reel ${reel.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Error toggling reel status:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle reel status' });
  }
};
