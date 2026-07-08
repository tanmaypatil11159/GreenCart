// Add address, path: /api/address/add
import Address from "../models/Address.js";

const requiredFields = ["firstName", "lastName", "email", "phone", "street", "city", "state", "country", "zipcode"];

// Add address
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const addressData = req.body?.address || req.body || {};

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const missingFields = requiredFields.filter((field) => {
      const value = addressData[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missingFields.length > 0) {
      return res.json({
        success: false,
        message: `Please fill all required fields: ${missingFields.join(", ")}`,
      });
    }

    const normalizedAddress = {
      ...addressData,
      userId,
      zipcode: String(addressData.zipcode).trim(),
      phone: String(addressData.phone).trim(),
      email: String(addressData.email).trim().toLowerCase(),
      street: String(addressData.street).trim(),
      city: String(addressData.city).trim(),
      state: String(addressData.state).trim(),
      country: String(addressData.country).trim(),
      firstName: String(addressData.firstName).trim(),
      lastName: String(addressData.lastName).trim(),
    };

    const newAddress = await Address.create(normalizedAddress);

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
