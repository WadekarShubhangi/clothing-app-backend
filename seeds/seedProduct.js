const fs = require("fs");
const Product = require("../models/product.model");

const productJsonData = fs.readFileSync("products.json", "utf-8");
const productsData = JSON.parse(productJsonData);

async function seedProduct() {
  try {
    for (const product of productsData) {
      const newProduct = new Product({
        title: product.title,
        brand: product.brand,
        description: product.description,
        image: product.image,
        rating: product.rating,
        totalRating: product.totalRating,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        discount: product.discount,
        stock: product.stock,
        category: product.category,
        size: product.size,
        colour: product.colour,
        tags: product.tags,
      });

      await newProduct.save();
      console.log(`Inserted product: ${product.title}`);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

module.exports = seedProduct;