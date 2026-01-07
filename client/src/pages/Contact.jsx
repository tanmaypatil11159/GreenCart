import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

export default function Contact() {
    const { user } = useAppContext();

    const whatsappNumber = "919730529222";
    const userName = user?.name || "Customer";

    const message = `Hello, my name is ${userName}. I am one of the customers of GreenCart.`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex justify-center ">
            <div
                className="w-full max-w-6xl
                   bg-white/20 backdrop-blur-2xl
                   border border-white/30
                   rounded-3xl
                   px-6 sm:px-10 md:px-14
                   py-8 sm:py-10"
            >
              
                <div className="mb-10">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
                        Contact
                        <img src={assets.logo} className="h-8" alt="logo" />
                    </h1>

                    <p className="text-gray-600 mt-2 max-w-lg text-sm">
                        Quick support via WhatsApp during working hours.
                    </p>
                </div>

           
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

                 
                    <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
                        <p>
                            <span className="font-medium text-gray-900">Office Location</span>
                            <br />
                            Kolhapur, Maharashtra, India
                        </p>

                        <p>
                            <span className="font-medium text-gray-900">Working Hours</span>
                            <br />
                            6:00 AM – 12:00 PM
                            <span className="block text-gray-500">(Closed on Monday)</span>
                        </p>

                        <p>
                            <span className="font-medium text-gray-900">Email Support</span>
                            <br />
                            support@greencart.com
                        </p>
                    </div>


                    <div className="w-full">
                        <div
                            className="bg-white/30 backdrop-blur-xl
               border border-white/40
               rounded-2xl
               px-6 sm:px-8 md:px-10
               py-6 sm:py-8
               text-center"
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
                                alt="WhatsApp"
                                className="w-24 h-24 mx-auto mb-4"
                            />

                            <h2 className="text-xl font-medium text-gray-900 mb-3">
                                WhatsApp Support
                            </h2>

                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                You will be introduced as
                                <span className="font-medium text-gray-900"> {userName}</span>.
                            </p>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center
                 w-full py-3
                 bg-green-600 hover:bg-green-700
                 text-white text-sm font-medium
                 rounded-full
                 transition-all duration-300
                 hover:-translate-y-0.5"
                            >
                                Contact via WhatsApp
                            </a>

                            <p className="text-xs text-gray-500 mt-4">
                                Instant support · No forms
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
