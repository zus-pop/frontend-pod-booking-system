import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { sliderData } from "../constants/data";
import { EffectFade, Autoplay } from "swiper";
import "swiper/css/effect-fade";
import "swiper/css";

const HeroSlider = () => {
    return (
        <Swiper
            modules={[EffectFade, Autoplay]}
            effect={"fade"}
            loop={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            className={`heroSlider h-screen`}
            onClick={(swiper, event) => {
                // Đảm bảo sự kiện click lan truyền ra ngoài Swiper
                event.stopPropagation();
                const customEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                event.target.dispatchEvent(customEvent);
            }}
        >
            {sliderData.map(({ id, title, bg }) => (
                <SwiperSlide
                    className="h-full relative flex justify-center items-center"
                    key={id}
                >
                    <div className="z-20 text-white text-center">
                        <div className="uppercase font-tertiary tracking-[6px] mb-5">
                            Just Enjoy & Relax
                        </div>
                        <h1 className="font-primary text-[32px] uppercase tracking-[2px] max-w-[920px] lg:text-[68px] leading-tight mb-6">
                            {title}
                        </h1>
                    </div>
                    <div className="absolute top-0 w-full h-full">
                        <img
                            className="object-cover h-full w-full"
                            src={bg}
                            alt="logo"
                        />
                    </div>
                    <div className="absolute w-full h-full bg-black/70" />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default HeroSlider;
