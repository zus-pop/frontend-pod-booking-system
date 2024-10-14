import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { sliderData } from '../constants/data';
import { EffectFade, Autoplay } from 'swiper';
import 'swiper/css/effect-fade';
import 'swiper/css';

const BookingHistorySlider = () => {
  return (
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect={'fade'}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className='heroSlider h-[600px] lg:h-[860px]'
    >
      {
        sliderData.map(({ id, bg }) =>
          <SwiperSlide className='h-full relative flex justify-center items-center' key={id}>
            <div className='absolute top-0 w-full h-full'>
              <img className='object-cover h-full w-full' src={bg} alt="background" />
            </div>
            <div className='absolute w-full h-full bg-black/70' />
          </SwiperSlide>
        )
      }
    </Swiper>
  )
};

export default BookingHistorySlider;
