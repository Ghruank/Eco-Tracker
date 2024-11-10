import React from 'react';
import Link from 'next/link';

const PerformanceMetrics = ({ coins }) => {
    // Define new style colors for the component background and text
    const componentBackground = '#d4edc9'; // Very light green background for each metric box
    const componentBorder = '#35a249';    // Dark green border for contrast
    const textPrimaryColor = '#35a249';   // Darker green text for titles and labels

    const EcoTip = ({ tip }) => (
        <div className="bg-green-100 rounded-lg p-4 text-green-800 mt-4">
          <h3 className="font-bold mb-2">Eco Tip of the Day</h3>
          <p>{tip}</p>
        </div>
      )

    return (
        <div className="flex flex-col w-full gap-5">
            {/* Pace Metric Box */}
            <div className="w-full p-4 border-2 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: componentBackground, borderColor: componentBorder }}>
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="relative group">
                        <Link href='/Travel'>
                        <img
                            src="/ecocoin.png" // Replace with the actual path to your image
                            alt="Centered icon"
                            className="w-28 h-28 transform transition-transform duration-200 ease-in-out group-hover:scale-110"
                        />
                        </Link>
                        {/* Tooltip at bottom right */}
                        <span className="absolute top-full left-full transform -translate-y-1 -translate-x-1  px-2 py-1 rounded bg-white text-gray-800 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                             {coins} ecoCoins
                        </span>
                    </div>
                </div>
                
            </div>
            
        </div>
    );
};

export default PerformanceMetrics;
