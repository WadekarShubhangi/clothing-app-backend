// const seedProduct = require("./seeds/seedProduct");
// const seedCategory = require("./seeds/seedCategory");

const Product = require("./models/product.model");
const Category = require("./models/category.model");
const Address = require("./models/address.model");
const Cart = require("./models/cart.model");
const Order = require("./models/order.model");
const Wishlist = require("./models/wishlist.model");

const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// seedCategory();
// seedProduct();

app.get("/favicon.ico", (req, res) => res.status(204).end());

async function readAllProducts() {
  try {
    const products = await Product.find().populate("category");
    return products;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const products = await readAllProducts();
    if (products.length != 0) {
      res.json({ data: { products } });
    } else {
      res.status(404).json({ error: "No Product found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

async function readProductById(id) {
  try {
    // when taking id from database id. like _id : ("6753298140646338")
    const product = await Product.findById(id);
    // when taking id from our json file. like : id : 1, 2
    // const product = await Product.findOne({ id: Number(id) });
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products/:prodId", async (req, res) => {
  try {
    const product = await readProductById(req.params.prodId);
    if (product) {
      res.status(200).json({ data: { product } });
    } else {
      res.status(404).json({ error: "No product found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Product by ID." });
  }
});

async function readAllCategory() {
  try {
    const category = await Category.find();
    return category;
  } catch (error) {
    throw error;
  }
}

app.get("/api/categories", async (req, res) => {
  try {
    const category = await readAllCategory();
    if (category.length != 0) {
      res.json({ data: { categories: category } });
    } else {
      res.status(404).json({ error: "No Category found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category." });
  }
});

async function readCategoryByCategoryId(category) {
  try {
    const product = await Product.find({ category: category });
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/categories/:categoryId", async (req, res) => {
  try {
    const category = await readCategoryByCategoryId(req.params.categoryId);
    if (category) {
      res.status(200).json({ data: { category } });
    } else {
      res.status(404).json({ error: "No category found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category by Category." });
  }
});

async function addWishlistData(productId) {
  try {
    // const newWishlistProduct = new Wishlist(productId);
    // const saveWishlist = await newWishlistProduct.save();
    // return saveWishlist;
    // ===========
    let wishlist = await Wishlist.findOne(); // single wishlist (for now)
    if (!wishlist) {
      wishlist = new Wishlist({ products: [] });
    }

    const alreadyInWishlist = wishlist.products.includes(productId);
    if (!alreadyInWishlist) {
      wishlist.products.push(productId);
    }

    const saved = await wishlist.save();
    return await saved.populate("products");
  } catch (error) {
    console.error("Error while saving new product to wishlist:", error.message);
    throw error;
  }
}

app.post("/api/wishlist", async (req, res) => {
  try {
    // const selectedProducts = await addWishlistData(req.body);
    // if (selectedProducts) {
    //   res.status(200).json({
    //     message: "Product wishlisted successfully.",
    //     wishlist: selectedProducts,
    //   });

    const { productId } = req.body;
    const updatedWishlist = await addWishlistData(productId);
    if (updatedWishlist) {
      res.status(200).json({
        message: "Product wishlisted successfully.",
        data: updatedWishlist,
      });
    } else {
      res.status(404).json({
        message: "Failed to add product to wishlist.",
        wishlist: selectedProducts,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

async function readAllWishlistProducts() {
  try {
    const products = await Wishlist.find().populate("products");
    return products;
  } catch (error) {
    throw error;
  }
}

app.get("/api/wishlist", async (req, res) => {
  try {
    const products = await readAllWishlistProducts();
    if (products.length != 0) {
      res.json({ data: { wishlist: products } });
    } else {
      res.status(404).json({ error: "No Wishlist Product found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist products." });
  }
});

async function addAddress(address) {
  try {
    const newAddress = new Address(address);
    const saveAddress = await newAddress.save();
    return saveAddress;
  } catch (error) {
    console.error("Error while saving new Address:", error.message);
    throw error;
  }
}

app.post("/api/address", async (req, res) => {
  try {
    const selectedAddress = await addAddress(req.body);
    if (selectedAddress) {
      res.status(200).json({
        message: "Address Added successfully.",
        address: selectedAddress,
      });
    } else {
      res
        .status(404)
        .json({ message: "Failed to add address.", address: selectedAddress });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

async function readAllAddress() {
  try {
    const newAddresses = await Address.find();
    return newAddresses;
  } catch (error) {
    throw error;
  }
}

app.get("/api/address", async (req, res) => {
  try {
    const newAddresses = await readAllAddress();
    if (newAddresses.length != 0) {
      res.json({ data: { address: newAddresses } });
    } else {
      res.status(404).json({ error: "No Address found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Address." });
  }
});

async function addDataToCart(productData) {
  try {
    const newCartData = new Cart(productData);
    const saveCartData = await newCartData.save();
    return saveCartData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.post("/api/cart", async (req, res) => {
  try {
    const newCartData = await addDataToCart(req.body);
    if (newCartData) {
      res.status(200).json({
        message: "Product Added to cart successfully.",
        cart: newCartData,
      });
    } else {
      res
        .status(404)
        .json({ message: "Failed to add product to cart.", cart: newCartData });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

async function readAllCartData() {
  try {
    const cartData = await Cart.find().populate("products.product");
    return cartData;
  } catch (error) {
    throw error;
  }
}

app.get("/api/cart", async (req, res) => {
  try {
    const cartData = await readAllCartData();
    if (cartData.length != 0) {
      res.status(200).json({
        message: "Product added to cart successfully.",
        data: { cart: cartData },
      });
    } else {
      res
        .status(404)
        .json({ error: "Failed to fetch cart data.", cart: cartData });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart data from server." });
  }
});

async function addOrders(data) {
  try {
    const newOrder = new Order(data);
    const saveNewOrder = await newOrder.save();
    return saveNewOrder;
  } catch (error) {
    throw error;
  }
}

app.post("/api/orders", async (req, res) => {
  try {
    const selectedOrders = await addOrders(req.body);
    if (selectedOrders) {
      res.status(200).json({
        message: "Orders added successfully.",
        order: selectedOrders,
      });
    } else {
      res
        .status(404)
        .json({ message: "Failed to add orders.", order: selectedOrders });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

async function readAllOrders() {
  try {
    const orderData = await Order.find()
      .populate("products")
      .populate("address");
    return orderData;
  } catch (error) {
    throw error;
  }
}

app.get("/api/orders", async (req, res) => {
  try {
    const orderData = await readAllOrders();
    if (orderData.length != 0) {
      res.status(200).json({
        message: "Orders",
        data: { orders: orderData },
      });
    } else {
      res
        .status(404)
        .json({ error: "Failed to fetch orders.", order: orderData });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders from server." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
