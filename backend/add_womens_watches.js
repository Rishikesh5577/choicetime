
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');

        // Check if it exists
        const existing = await Category.findOne({ slug: 'womens-watches' });
        if (existing) {
            console.log('Category already exists:', existing);
            process.exit(0);
        }

        // Create it
        try {
            const newCat = await Category.create({
                name: "Womens Watches",
                slug: "womens-watches",
                productType: "watches",
                gender: "women",
                subCategory: "",
                path: "/watches?gender=women",
                order: 2, // Mens is probably 1 or 0
                subItems: [
                    { name: "Analog Watches", path: "/watches?gender=women&subCategory=analog" }
                ]
            });
            console.log('✅ Successfully added "Womens Watches" category!');
            console.log(newCat);
        } catch (err) {
            console.error('Failed to create:', err.message);
        }

        process.exit(0);
    })
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    });
