import React from 'react';
import { ScrollToTop } from '../components';

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-24">
      <ScrollToTop />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-primary text-[45px] mb-4">About Our Poddy</h1>
        <p className="text-xl text-gray-600">Discover the perfect blend of coffee and workspace with us</p>
      </div>

      {/* Main Content Section - Giảm margin-bottom và thêm margin-top âm */}
      <div className="container mx-auto px-4 mb-16 -mt-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Video Section */}
          <div className="w-full lg:w-1/2 rounded-lg overflow-hidden shadow-xl">
            <video 
              className="w-full aspect-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="videoplayback.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Poddy Coffee and Workspace is a unique blend of coffee shop and co-working space, designed to provide a comfortable and productive environment for professionals, freelancers, and students alike. Our mission is to create a space where great ideas can flourish, fueled by excellent coffee and supported by state-of-the-art facilities.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With multiple locations across Ho Chi Minh City, we offer a variety of workspace options to suit different needs, from individual pods for focused work to meeting rooms for collaborative sessions. At Poddy, we believe in fostering a community of like-minded individuals who inspire and support each other in their professional journeys.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="text-center p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Diverse Spaces</h3>
            <p className="text-gray-600">Explore our wide variety of workspace options designed for every need.</p>
          </div>

          {/* Feature 2 */}
          <div className="text-center p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Service</h3>
            <p className="text-gray-600">Our team of dedicated staff is here to support your work and comfort.</p>
          </div>

          {/* Feature 3 */}
          <div className="text-center p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M15.293 5.293a1 1 0 011.414 0l1 1a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L8 13.586l7.293-7.293z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Facilities</h3>
            <p className="text-gray-600">State-of-the-art amenities and premium coffee for your optimal experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
