import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PerformanceMetrics = ({ scores }) => {
    const { pace, clarity } = scores;

    // Define colors for each metric
    const colors = {
        pace: "#5bacfe",         // Blue for Travel metric
        clarity: "rgba(255, 159, 64, 1)"        // Red for Energy metric
    };

    // Define new style colors for the component background and text
    const componentBackground = '#d4edc9'; // Very light green background for each metric box
    const componentBorder = '#35a249';    // Dark green border for contrast
    const textPrimaryColor = '#35a249';   // Darker green text for titles and labels

    return (
        <div className="flex flex-col w-full gap-5">
            {/* Pace Metric Box */}
            <div className="w-full p-4 border-2 rounded-lg flex items-center" style={{ backgroundColor: componentBackground, borderColor: componentBorder }}>
                <div className="w-16 h-16">
                    <CircularProgressbar
                        value={pace}
                        text="Travel"
                        styles={buildStyles({
                            pathColor: colors.pace,
                            textColor: textPrimaryColor,
                            trailColor: '#e5f4e3', // Light green for trail
                            textSize: '18px',
                        })}
                    />
                </div>
                <div className="flex-1 text-center" style={{ color: textPrimaryColor, fontWeight: 'bold', fontSize: '18px' }}>Travel Metric</div>
            </div>

            {/* Modulation Metric Box
            <div className="w-full p-4 border-2 rounded-lg flex items-center" style={{ backgroundColor: componentBackground, borderColor: componentBorder }}>
                <div className="w-16 h-16">
                    <CircularProgressbar
                        value={modulation}
                        text="Purchase"
                        styles={buildStyles({
                            pathColor: colors.modulation,
                            textColor: textPrimaryColor,
                            trailColor: '#e5f4e3',
                            textSize: '18px',
                        })}
                    />
                </div>
                <div className="flex-1 text-center" style={{ color: textPrimaryColor, fontWeight: 'bold', fontSize: '18px' }}>Purchase Metric</div>
            </div> */}

            {/* Clarity Metric Box */}
            <div className="w-full p-4 border-2 rounded-lg flex items-center" style={{ backgroundColor: componentBackground, borderColor: componentBorder }}>
                <div className="w-16 h-16">
                    <CircularProgressbar
                        value={clarity}
                        text="Energy"
                        styles={buildStyles({
                            pathColor: colors.clarity,
                            textColor: textPrimaryColor,
                            trailColor: '#e5f4e3',
                            textSize: '18px',
                        })}
                    />
                </div>
                <div className="flex-1 text-center" style={{ color: textPrimaryColor, fontWeight: 'bold', fontSize: '18px' }}>Energy Metric</div>
            </div>
        </div>
    );
};

export default PerformanceMetrics;
