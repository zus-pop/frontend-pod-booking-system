import React from 'react';
import { ScrollToTop } from "../components";
import { FaCheckCircle } from 'react-icons/fa';

const Policy = () => {
  const policies = [
    {
      title: "Booking Policy",
      items: [
        "Customers can view and select PODs without logging in",
        "Login is required to make a booking",
        "Each POD can only be booked by one user at a specific time slot",
        "Bookings are only confirmed after successful payment"
      ]
    },
    {
      title: "Payment Policy",
      items: [
        "Online payments accepted through Zalopay",
        "Service prices may vary depending on time and POD type",
        "Payment via Zalopay must be completed within 10 minutes, otherwise a booking will be automatically canceled",
        "System automatically updates booking status after payment completion"
      ]
    },
    {
      title: "Refund Policy",
      items: [
        "No refunds for successfully paid bookings",
        "100% refund for issues caused by our facility",
        "Refund processing takes up to 7 business days",
        "Refunds will be returned to the original payment method"
      ]
    },
    {
      title: "Service Usage Policy",
      items: [
        "Customers can order additional services (beverages, ...)",
        "Track booking history and service usage progress",
        "Customers can rate and provide feedback after service usage",
        "Follow rules and scheduled times to ensure service quality"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      <ScrollToTop />
      
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl lg:text-7xl font-primary">
            <span className="text-black">Our </span>
            <span className="text-accent">Policies</span>
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            Committed to providing the best experience for our customers
          </p>
        </div>
      </div>

      {/* Policies Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {policies.map((policy, index) => (
            <div 
              key={index} 
              className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-4 text-accent">
                {policy.title}
              </h2>
              <ul className="space-y-3">
                {policy.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <FaCheckCircle className="text-accent mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Notes */}
        <div className="mt-12 bg-accent/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-accent">
            Important Notes
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-accent mt-1" />
              <span className="text-gray-700">
                We are always ready to assist and answer any questions about our policies
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-accent mt-1" />
              <span className="text-gray-700">
                Policies may be updated to adapt to actual situations, all changes will be announced in advance
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Policy; 