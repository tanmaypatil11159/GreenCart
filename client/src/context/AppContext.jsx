import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"

// Backend connections
axios.defaults.withCredentials = true;
const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, "");
axios.defaults.baseURL = backendUrl || "";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setshowUserLogin] = useState(false);
    const [product, setProduct] = useState([]);

    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    //fetch seller function
    const fetchSeller = async () => {
        try {
            const {data} = await axios.get('/api/seller/is-auth')
            if(data.success) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch (error) {
             setIsSeller(false)
        }
    }

    // fetch user status
    const fetchUser = async () => {
        try {
            const {data} = await axios.get("/api/user/is-auth")
            if(data.success) {
                setUser(data.user)
                setCartItems(data.user?.cartItems ?? {})
            }
        } catch (error) {
            setUser(null)
        }
    }


    // Fetch All Product
    const fetchProduct = async () => {
        try {
            const {data} = await axios.get('/api/product/list');
            if(data.success) {
                setProduct(data.product);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };


    // get item count in cart
    const getCartCount = () => {
        let totalCount = 0;
        for(const item in cartItems ) {
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    // get total amount from the cart
    const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
        let itemInfo = product.find(product => product._id === itemId);

        if (itemInfo && cartItems[itemId] > 0) {
            totalAmount += itemInfo.offerPrice * cartItems[itemId];
        }
    }
    return Math.floor(totalAmount * 100) / 100;
};


    // Add Product to cart
    const AddToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    // Update cart quantity
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);
        toast.success("Cart Updated");
    };

    // Remove from the cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] -= 1;

            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        setCartItems(cartData);
        toast.success("Removed from Cart");
    };

    useEffect(() => {
        fetchSeller();
        fetchProduct();
        fetchUser();
    }, []);

    // Update DataBase cartItems
    useEffect(()=> {
       const updateCart = async ()=>{
            try {
                const {data} = await axios.post('/api/cart/update', {cartItems})
                if(!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        
        if(user) {
            updateCart()
        }
    },[cartItems])

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setshowUserLogin,
        product,
        currency,
        AddToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartAmount,
        axios,
        fetchProduct,
        setCartItems
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
