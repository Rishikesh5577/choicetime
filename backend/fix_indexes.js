
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');

        const collection = Category.collection;
        const indexes = await collection.getIndexes();
        console.log('Current Indexes:', indexes);

        if (indexes.value_1) {
            console.log('Found bad index "value_1". Dropping it...');
            await collection.dropIndex('value_1');
            console.log('Index dropped.');
        } else {
            console.log('Index "value_1" not found. Checking for other potential bad unique indexes...');
            // Look for any unique index that isn't _id or slug
            for (const [name, def] of Object.entries(indexes)) {
                if (name !== '_id_' && name !== 'slug_1' && name !== 'order_1') {
                    // Check if it's unique
                    // The definition is usually [[ 'field', 1 ]]
                    // Mongoose getIndexes returns object
                    // Actually collection.indexes() returns array in shell, getIndexes() returns object map in driver
                    console.log(`Checking index ${name}...`);
                    // We can force drop if we are unsure, but let's be safe.
                    // If the error was specifically value_1, we drop that.
                }
            }
        }

        process.exit(0);
    })
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    });
