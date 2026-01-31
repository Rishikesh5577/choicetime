// Sample data for the new Watch schema (WATCH collection)
// This matches the structure you provided

export const sampleWatchNewData = [
  {
    title: "Men's Premium Analog Watch",
    mrp: 674,
    discountPercent: 11,
    description: "Elegant men's analog watch offering precision timekeeping, durable construction, stylish design, comfortable strap, reliable movement, and timeless everyday performance for modern fashion enthusiasts.",
    category: "WATCH",
    categoryId: "679a3c4f92b12a45bc12ef91", // Can be ObjectId string or actual ObjectId
    product_info: {
      brand: "TimeMaster",
      manufacturer: "TimeMaster Industries",
      IncludedComponents: "1 Watch"
    },
    images: {
      image1: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765522499/page_5_img_21_qhifnw.jpg"
    },
    stock: 50,
    isNewArrival: false,
    onSale: true,
    isFeatured: false,
    inStock: true
  },
  {
    title: "Women's Elegant Digital Watch",
    mrp: 899,
    discountPercent: 15,
    description: "Stylish digital watch for women with modern features and elegant design.",
    category: "WATCHES",
    categoryId: "679a3c4f92b12a45bc12ef91",
    product_info: {
      brand: "FashionTime",
      manufacturer: "FashionTime Corp",
      IncludedComponents: "1 Watch, 1 Manual"
    },
    images: {
      image1: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765522499/page_5_img_21_qhifnw.jpg",
      image2: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765522499/page_5_img_22_qhifnw.jpg"
    },
    stock: 30,
    isNewArrival: true,
    onSale: true,
    isFeatured: true,
    inStock: true
  }
];

// Usage example:
// import WatchNew from './models/product/watchNew.model.js';
// import { sampleWatchNewData } from './sampleWatchNewData.js';
// 
// // Insert sample data
// for (const watch of sampleWatchNewData) {
//   await WatchNew.create(watch);
// }

