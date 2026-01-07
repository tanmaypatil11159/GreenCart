import {v2 as cloudinary} from 'cloudinary'
import Product from '../models/Product.js';

// Add Product, path: /api/product/add
export const addProduct = async (req, res) => {
    try {
        const images = req.files || [];

        // productData may come as a JSON string in a multipart/form-data request
        // or as the body object when no files are uploaded. Guard against undefined.
        const raw = req.body && (req.body.productData ?? req.body);
        if (!raw) {
            return res.json({ success: false, message: "productData is required" });
        }

        let productData;
        if (typeof raw === "string") {
            try {
                productData = JSON.parse(raw);
            } catch (err) {
                return res.json({ success: false, message: "Invalid productData JSON" });
            }
        } else {
            productData = raw;
        }

        let imagesUrl = [];
        if (images.length) {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        await Product.create({ ...productData, image: imagesUrl });
        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get Product, path: /api/product/list
export const productList = async (req, res) => {
    try {
        const product = await Product.find({})
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// get single Product, path: /api/product/id
export const productById = async (req, res) => {
    try {
        const {id} = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// change Product inStock, path: /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const {id, inStock} = req.body;
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}
