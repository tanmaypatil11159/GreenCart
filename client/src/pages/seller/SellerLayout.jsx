import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const {axios , navigate} = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];

    const logout = async () => {
        try {
            const {data} = await axios.get("/api/seller/logout")
            if(data.success) {
                toast.success(data.message);
                navigate('/')
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            {/* HEADER (non-scrollable) */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <Link to="/">
                    <img className="cursor-pointer w-34 md:w-38" src={assets.logo} alt="logo" />
                </Link>

                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button onClick={logout} className="border rounded-full text-sm px-4 py-1">
                        Logout
                    </button>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex h-[calc(100vh-64px)] overflow-hidden">

                {/* SIDEBAR (fixed, no scroll) */}
                <div className="md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col overflow-y-auto scrollbar-hide">

                    {sidebarLinks.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            end={item.path === "/seller"}
                            className={({ isActive }) =>
                                `flex items-center py-3 px-4 gap-3 
                                ${
                                    isActive
                                        ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary"
                                        : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <img src={item.icon} alt="" className="h-7 w-7" />
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}

                </div>

                {/* RIGHT SIDE CONTENT (scrollable area) */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default SellerLayout;
