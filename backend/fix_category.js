
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const cat = await Category.findOne({ slug: 'womens-watches' });
        if (cat) {
            console.log('Found existing category:', cat.name, 'with slug:', cat.slug);
            await Category.deleteOne({ _id: cat._id });
            console.log('Successfully deleted existing category. You can now add it again via the dashboard.');
        } else {
            console.log('Category "womens-watches" not found in database.');
            // List all slugs
            const all = await Category.find({}, 'slug name');
            console.log('Existing categories:', all.map(c => `${c.name} (${c.slug})`).join(', '));
        }
        process.exit(0);
    })
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    });
