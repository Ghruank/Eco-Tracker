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
import { Award } from "lucide-react";


import EcoPointsHistogram from "./EcoPoints";

const PerformanceMetrics = ({ coins }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 text-green-800">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Award className="mr-2" /> Eco Coins
      </h2>
      <div className="text-4xl font-bold">{coins}</div>
      <p className="mt-2 text-sm">Keep up the great work!</p>
    </div>
  )

  const EcoTip = ({ tip }) => (
    <div className="bg-green-100 rounded-lg p-4 text-green-800 mt-4">
      <h3 className="font-bold mb-2">Eco Tip of the Day</h3>
      <p>{tip}</p>
    </div>
  )


export default function Dashboard() {
    // Sample performance data (in a real app, this would come from your backend)
    
    const coins=256;

    const generateUsers = (count = 50) => {
        return Array.from({ length: count }, (_, i) => ({
          id: i + 1,
          ecoPoints: Math.floor(Math.random() * 101), // Generates a random ecoPoints value between 0 and 100
        }));
      };

      const users = generateUsers(50);

      const userEcoPoints = 15;

    return (
        <div className="w-full h-screen" style={{ backgroundColor: '#ffffff' }}> {/* lightest green background */}
            <Sidebar />
            <div className="flex w-full ">
                <div className="w-full h-full mt-20">
                    <div className="flex flex-col mt-4 md:flex-row ">
                    <div className="w-full px-2 pb-2 border-2 rounded-md border-gray-800 mx-2 md:w-2/3">
  <div className="w-4/4 h-full mx-auto"> {/* Set the width to 3/4 of the container and increase the height */}
    <EcoPointsHistogram users={users} userEcoPoints={userEcoPoints} />
  </div>
</div>
                        <div className="flex-1 px-2 mt-12 md:mt-0 " style={{ backgroundColor: '#ffffff', color: '#0b3822' }}> {/* Lighter green */}
                        <PerformanceMetrics coins={coins} />
                        <EcoTip tip="Using a reusable water bottle can save up to 1,460 plastic bottles per year!" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}