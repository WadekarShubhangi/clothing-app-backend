const fs = require("fs");
const Category = require("../models/category.model");
const categoryJsonData = fs.readFileSync("category.json", "utf-8");
const categoriesData = JSON.parse(categoryJsonData);

async function seedCategory() {
  try {
    for (const category of categoriesData) {
      const newCategory = new Category({
        name: category.name,
        image: category.image
      });
      await newCategory.save();
      console.log(`Inserted Category: ${category.name}`);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

module.exports = seedCategory;