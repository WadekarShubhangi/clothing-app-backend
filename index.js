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
    let wishlist = await Wishlist.findOne();
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
    const updatedWishlist = await addWishlistData(req.body.productId);
    if (updatedWishlist) {
      res.status(200).json({
        message: "Product wishlisted successfully.",
        wishlist: updatedWishlist,
      });
    } else {
      res.status(404).json({
        message: "Failed to add product to wishlist.",
        wishlist: updatedWishlist,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

async function readAllWishlistProducts() {
  try {
    const products = await Wishlist.findOne().populate("products");
    return products;
  } catch (error) {
    throw error;
  }
}

app.get("/api/wishlist", async (req, res) => {
  try {
    const products = await readAllWishlistProducts();
    if (products) {
      res.json({ data: { wishlist: products } });
    } else {
      res.status(404).json({ error: "No Wishlist Product found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist products." });
  }
});

async function deleteWishlistData(productId) {
  try {
    // const catchProdId = await Wishlist.findByIdAndDelete(productId)
    // return catchProdId;

    const wishlist = await Wishlist.findOne();
    if (!wishlist) return null;

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    const saved = await wishlist.save();
    return await saved.populate("products");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.delete("/api/wishlist/:productId", async (req, res) => {
  try {
    const deletedProduct = await deleteWishlistData(req.params.productId);
    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Product." });
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

// Cart

async function addDataToCart(productId) {
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ products: [] });
    }

    let alreadyExists = false;

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (existingProduct) {
      alreadyExists = true;
    } else {
      cart.products.push({ product: productId });
    }

    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate("products.product");

    return { alreadyExists, cart: populatedCart };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


app.post("/api/cart", async (req, res) => {
  try {
    const newCartData = await addDataToCart(req.body.productId);
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
    const cartData = await Cart.findOne().populate("products.product");
    return cartData;
  } catch (error) {
    throw error;
  }
}

app.get("/api/cart", async (req, res) => {
  try {
    const cartData = await readAllCartData();
    if (cartData) {
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

async function deleteCartData(productId) {
  try {
    const cart = await Cart.findOne();
    if (!cart) return null;

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    const saved = await cart.save();
    return await saved.populate("products.product");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.delete("/api/cart/:productId", async (req, res) => {
  try {
    const deletedProduct = await deleteCartData(req.params.productId);
    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Product." });
  }
});

async function updateCartQuantity(productId, action) {
  try {
    const cart = await Cart.findOne();
    if (!cart) return null;

    const item = cart.products.find((p) => p.product.toString() === productId);
    if (!item) return null;

    if (action === "increment") {
      item.quantity += 1;
    } else if (action === "decrement") {
      item.quantity -= 1;
      if (item.quantity < 1) {
        cart.products = cart.products.filter(
          (p) => p.product.toString() !== productId
        );
      }
    }

    const savedCart = await cart.save();
    return await savedCart.populate("products.product");
  } catch (error) {
    console.log("Error in updating cart quantity.", error);
    throw error;
  }
}

app.post("/api/cart/update", async (req, res) => {
  try {
    const { productId, action } = req.body;
    const updatedCart = await updateCartQuantity(productId, action);
    if (updatedCart) {
      res.status(200).json({
        message: "Cart updated successfully.",
        cart: updatedCart,
      });
    } else {
      res.status(404).json({ message: "Product not found in cart." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart." });
  }
});

// Address
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
