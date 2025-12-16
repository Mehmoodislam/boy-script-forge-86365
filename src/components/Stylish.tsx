import React from 'react';
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import boy116 from "@/assets/boy116.webp";


const Stylish = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* Left Content */}
                <div>
                    <h2 className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight break-words text-center">
                        Stylish Boy DP & Cute Boy Pics for Profile Inspiration
                    </h2>

                    <p className=" text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words  mt-5">
                        Looking for a <b>stylish boy dp</b> to upgrade your profile picture?
                    </p>
                    <p className=" text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words mt-2">
                        We also feature a curated collection of <b>cute boy pics, boys stylish dp,</b> and <b>stylish boy photos</b> to inspire your AI creations or use directly on social media.
                    </p>
                    <p className=" text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words mt-2">
                        These images are perfect for:
                    </p>
                    <ul className='pl-4'>
                        <li className=' text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words'>WhatsApp profile pictures</li>
                        <li className=' text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words'>Facebook & Instagram DP</li>
                        <li className=' text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words'>Style inspiration for AI prompts</li>
                    </ul>
                    <p className="text-lg text-muted-foreground mt-2">
                        <b>👉 Explore Full Collection:</b>
                    </p>
                    <Link to="/gallery">
                        <Button size="lg" className=" bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg hover:shadow-xl transition-all group mt-4   text-sm sm:text-base whitespace-normal break-words text-center px-4">
                                Stylish Boy DP - Cute Boy Pics & HD Photos                      
                        </Button>
                    </Link>
                </div>

                {/* Right Image */}
                <div className="w-full">
                    <img
                        src={boy116}
                        alt="Stylish Boy DP"
                         loading="lazy"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                </div>

            </div>
        </section>
    );
};

export default Stylish;
