import React from 'react';
import { FaCoffee } from 'react-icons/fa';

const Logo = ({ isDark }) => (
  <div className="flex items-center">
    <FaCoffee className={`text-4xl ${isDark ? 'text-yellow-800' : 'text-stone-300'}`} />
    <div className="ml-2">
      <div className={`text-xl font-bold ${isDark ? 'bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-500  text-transparent bg-clip-text' : 'text-stone-300'}`}>Poddy</div>
      <div className={`text-sm  ${isDark ? 'bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-500  text-transparent bg-clip-text' : 'text-stone-300'}`}>Coffee and Workspace</div>
    </div>
  </div>
);

export default Logo; 