// components/EcoPointsHistogram.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EcoPointsHistogram = ({ users, userEcoPoints }) => {
  // Define 20 bins for Eco Points ranges (e.g., 0-5, 5-10, ..., 95-100)
  const bins = Array.from({ length: 20 }, (_, i) => i * 5);
  
  // Calculate the number of users in each Eco Points range
  const ecoPointsDistribution = bins.map((binStart) => {
    const binEnd = binStart + 5;
    const count = users.filter(user => user.ecoPoints >= binStart && user.ecoPoints < binEnd).length;
    return (count / users.length) * 100; // Percentage of users in this range
  });

  // Determine the user’s Eco Points bin for highlight
  const userBinIndex = Math.min(
    Math.floor(userEcoPoints / 5),
    ecoPointsDistribution.length - 1
  );

  // Data for the bar chart
  const data = {
    labels: bins.map((binStart) => `${binStart}-${binStart + 5}`),
    datasets: [
      {
        label: 'Percentage of Users',
        data: ecoPointsDistribution,
        backgroundColor: ecoPointsDistribution.map((_, i) =>
          i === userBinIndex ? 'rgba(75, 192, 192, 0.6)' : 'rgba(153, 102, 255, 0.6)'
        ),
        borderColor: ecoPointsDistribution.map((_, i) =>
          i === userBinIndex ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Eco Points' },
      },
      y: {
        title: { display: true, text: 'Percentage of Users' },
        beginAtZero: true,
        max: 50, // Set the maximum Y-axis value to 50
        ticks: {
          stepSize: 10, // Only show labels in increments of 10
          callback: (value) => (value <= 50 ? value : null), // Show labels only up to 50
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            context.dataIndex === userBinIndex
              ? `Your Eco Points: ${userEcoPoints}`
              : `Percentage of Users: ${context.raw.toFixed(2)}%`,
        },
      },
    },
  };
  

  return <Bar data={data} options={options} />;
};

export default EcoPointsHistogram;
