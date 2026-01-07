import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function Navbar() {

    const [open, setOpen] = React.useState(false)
    const { user, setUser, setshowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message);
                setUser(null)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products")
        }
    }, [searchQuery])

    const navLinkClass =
        "relative font-medium transition-all duration-300 ease-out " +
        "after:content-[''] after:absolute after:left-0 after:-bottom-1 " +
        "after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 " +
        "hover:after:w-full hover:text-primary hover:-translate-y-[1px]";

    return (
        <nav
            className="fixed top-0 left-0 w-full z-50
                       bg-white/30 backdrop-blur-xl
                       border-b border-white/20
                       shadow-[0_8px_30px_rgba(0,0,0,0.05)]
                       px-[30px] py-4
                       flex items-center justify-between
                       transition-all"
        >

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className='h-9' src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/' className={navLinkClass}>Home</NavLink>
                <NavLink to='/products' className={navLinkClass}>All Products</NavLink>
                <NavLink to='/contact' className={navLinkClass}>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2
                                bg-white/30 backdrop-blur-md
                                border border-white/30
                                px-3 rounded-full shadow-sm">
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                    />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>

                <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white
                                       bg-primary/90 backdrop-blur
                                       w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </button>
                </div>

                {!user ? (
                    <button
                        onClick={() => setshowUserLogin(true)}
                        className="cursor-pointer px-8 py-2
                                   bg-primary/90 hover:bg-primary
                                   transition-all duration-300
                                   text-white rounded-full backdrop-blur
                                   hover:scale-105">
                        Login
                    </button>
                ) : (
                    <div className="relative group">
                        <img src={assets.profile_icon} className="w-10 cursor-pointer hover:scale-105 transition" alt="" />
                        <ul className="hidden group-hover:block absolute top-10 right-0
                                       bg-white/40 backdrop-blur-xl
                                       shadow-lg border border-white/30
                                       py-2.5 w-32 rounded-xl text-sm z-40">
                            <li
                                onClick={() => navigate("my-orders")}
                                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer transition">
                                My Orders
                            </li>
                            <li
                                onClick={logout}
                                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer transition">
                                LogOut
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
                <img src={assets.menu_icon} alt="menu" />
            </button>

            {/* Mobile Menu */}
            {open && (
                <div
                    className="absolute top-[60px] left-0 w-full
                               bg-white/40 backdrop-blur-xl
                               shadow-xl border border-white/30
                               py-5 flex flex-col items-start gap-3
                               px-6 text-sm md:hidden
                               transition-all duration-300 rounded-b-2xl"
                >
                    <NavLink to='/' onClick={() => setOpen(false)} className="w-full py-2 hover:bg-white/30 rounded-md transition">
                        Home
                    </NavLink>

                    <NavLink to='/products' onClick={() => setOpen(false)} className="w-full py-2 hover:bg-white/30 rounded-md transition">
                        All Products
                    </NavLink>

                    {user && (
                        <NavLink to='/products' onClick={() => setOpen(false)} className="w-full py-2 hover:bg-white/30 rounded-md transition">
                            My Products
                        </NavLink>
                    )}

                    <NavLink to='/contact' onClick={() => setOpen(false)} className="w-full py-2 hover:bg-white/30 rounded-md transition">
                        Contact
                    </NavLink>

                    {!user ? (
                        <button
                            onClick={() => {
                                setOpen(false);
                                setshowUserLogin(true);
                            }}
                            className="cursor-pointer px-6 py-2 mt-2 w-full text-center
                                       bg-primary/90 hover:bg-primary
                                       transition-all duration-300
                                       text-white rounded-full text-sm
                                       backdrop-blur hover:scale-105"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={logout}
                            className="cursor-pointer px-6 py-2 mt-2 w-full text-center
                                       bg-primary/90 hover:bg-primary
                                       transition-all duration-300
                                       text-white rounded-full text-sm
                                       backdrop-blur hover:scale-105"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}

        </nav>
    )
}
