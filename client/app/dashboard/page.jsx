// "use client";
// import Sidebar from "./sidebar";
// import PerformanceChart from "./PerformanceChart";
// import PerformanceMetrics from "./Scores";

// export default function Dashboard() {


   
//     // Sample performance data (in a real app, this would come from your backend)
//     const performanceData = {
//         labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'], // x-axis labels
//         paceData: [70, 75, 78, 82, 85], // Pace scores for each session
//         modulationData: [65, 68, 72, 76, 79], // Modulation scores
//         clarityData: [80, 82, 85, 88, 90], // Clarity scores
//     };

    
    
//     const scores = {
//         pace: 80,
//         modulation: 65,
//         clarity: 75,
//     };

//     return (
//         <div className="w-full h-screen bg-black">
//             <Sidebar />
//             <div className="flex w-full ">
//                 <div className="w-full h-full mt-16">
//                     <div className="flex flex-col mt-4 md:flex-row "> {/* Stack vertically on small screens, horizontally on medium and larger screens */}
//                         <div className="w-full px-2 pb-2 md:w-2/3"> {/* Full width on smaller screens */}
//                             <PerformanceChart performanceData={performanceData} />
//                         </div>
//                         <div className="flex-1  px-2 md: mt-4 md:mt-0"> {/* Add margin on larger screens */}
//                             <PerformanceMetrics scores={scores} />
//                         </div>
                        
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";
import Sidebar from "./sidebar";
import PerformanceChart from "./PerformanceChart";
import PerformanceMetrics from "./Scores";

export default function Dashboard() {
    // Sample performance data (in a real app, this would come from your backend)
    const performanceData = {
        labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'], // x-axis labels
        paceData: [70, 75, 78, 82, 85], // Pace scores for each session
        clarityData: [80, 82, 85, 88, 90], // Clarity scores
    };

    const scores = {
        pace: 80,
        clarity: 75,
    };

    return (
        <div className="w-full h-screen" style={{ backgroundColor: '#ffffff' }}> {/* lightest green background */}
            <Sidebar />
            <div className="flex w-full ">
                <div className="w-full h-full mt-16">
                    <div className="flex flex-col mt-4 md:flex-row ">
                        <div className="w-full px-2 pb-2 md:w-2/3">
                            <PerformanceChart performanceData={performanceData} style={{ backgroundColor: '#ffffff', color: '#fff' }} /> {/* Medium green */}
                        </div>
                        <div className="flex-1 px-2 md:mt-4 md:mt-0" style={{ backgroundColor: '#ffffff', color: '#0b3822' }}> {/* Lighter green */}
                            <PerformanceMetrics scores={scores} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}