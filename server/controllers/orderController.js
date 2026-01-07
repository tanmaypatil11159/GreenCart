// controllers/orderController.js

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Stripe from "stripe";

/* ============================
   PLACE ORDER - COD
   ============================ */
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FROM AUTH MIDDLEWARE
    const { address, items } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient data",
      });
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add 2% tax
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from auth middleware
    const { address, items } = req.body;
    const origin = req.headers.origin;

    if (!origin) {
      return res.status(400).json({
        success: false,
        message: "Origin header missing",
      });
    }

    if (!address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient data",
      });
    }

    let amount = 0;
    const productData = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      amount += product.offerPrice * item.quantity;

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
    }

    // Add 2% tax ONCE
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Stripe line items
    const line_items = productData.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 1.02 * 100), // price + 2% tax
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("STRIPE ORDER ERROR 👉", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ============================
   GET USER ORDERS
   ============================ */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate([
        { path: "items.product", model: "Product" },
        { path: "address", model: "Address", strictPopulate: false },
      ])
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   GET ALL ORDERS (SELLER)
   ============================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate([
        { path: "items.product", model: "Product" },
        { path: "address", model: "Address", strictPopulate: false },
      ])
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
