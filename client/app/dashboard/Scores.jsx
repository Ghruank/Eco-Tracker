import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PerformanceMetrics = ({ scores }) => {
    const { pace, modulation, clarity } = scores;

    // Define colors for each metric
    const colors = {
        pace: "#00C853",         // Green for Pace
        modulation: "#FFB300",    // Yellow for Modulation
        clarity: "#D32F2F"        // Red for Clarity
    };

    return (
        <div className="flex flex-col w-full  ">
        <div className=" w-full bg-black text-white p-4  border-2 rounded-lg flex ">

            {/* Pace Progress Bar */}
            <div className=" w-16 h-16  ">
                <CircularProgressbar
                    value={pace}
                    text="Travel"
                    styles={buildStyles({
                        pathColor: colors.pace,
                        textColor: '#ffffff',
                        trailColor: '#333',
                        textSize:18
                    })}
                />
                
            </div>
            
            <div className="flex justify-center items-center mx-6">hello</div>
            </div>
            <div className="w-full  bg-black text-white p-4 mt-5 border-2 rounded-lg flex  ">
            {/* Modulation Progress Bar */}
            <div className="w-16 h-16 ">
                <CircularProgressbar
                    value={modulation}
                    text="Purchase"
                    styles={buildStyles({
                        pathColor: colors.modulation,
                        textColor: '#ffffff',
                        trailColor: '#333',
                        textSize:18
                    })}
                />
            </div>
            <div className="flex justify-center items-center mx-6">hello</div>
            </div>
            <div className="w-full  bg-black text-white p-4 mt-5  border-2 rounded-lg flex  ">
            {/* Clarity Progress Bar */}
            <div className="w-16 h-16 ">
                <CircularProgressbar
                    value={clarity}
                    text="Energy"
                    styles={buildStyles({
                        pathColor: colors.clarity,
                        textColor: '#ffffff',
                        trailColor: '#333',
                        textSize:18
                    })}
                />
            </div>
            <div className="flex justify-center items-center mx-6">hello</div>
            </div>
            </div>
    );
};

export default PerformanceMetrics;
