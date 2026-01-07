// Add address, path: /api/address/add
import Address from "../models/Address.js";

// Add address
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { address } = req.body;

    const newAddress = await Address.create({
      ...address,
      userId
    });

    res.json({ success: true, address: newAddress });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Get address , path: /api/address/get
// Get address , path: /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIXED

    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized"
      });
    }

    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
