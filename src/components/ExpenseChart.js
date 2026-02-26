import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import './Components.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ExpenseChart = ({ participants, type }) => {
  const chartRef = useRef(null);

  // Cleanup function to destroy chart instance
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Prepare data for charts
  const names = participants.map(p => p.name);
  const paidAmounts = participants.map(p => p.paid);
  const balances = participants.map(p => Math.abs(p.balance));
  
  // Generate colors based on balance status
  const doughnutColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
  ];

  const barColors = participants.map(p => 
    p.balance >= 0 ? '#4BC0C0' : '#FF6384'
  );

  const doughnutData = {
    labels: names,
    datasets: [
      {
        data: paidAmounts,
        backgroundColor: doughnutColors.slice(0, participants.length),
        borderColor: doughnutColors.slice(0, participants.length),
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: names,
    datasets: [
      {
        label: 'Amount to Pay/Receive',
        data: balances,
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          },
          color: '#333'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed && context.parsed.y !== undefined) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            } else {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.raw);
            }
            return label;
          }
        }
      }
    },
  };

  const barOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  if (participants.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>Add participants to see charts</p>
      </div>
    );
  }

  // Check if all paid amounts are zero
  const allZero = paidAmounts.every(amount => amount === 0);
  if (allZero) {
    return (
      <div className="chart-placeholder">
        <p>Add expenses to see payment distribution</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {type === 'doughnut' ? (
        <Doughnut 
          ref={chartRef}
          data={doughnutData} 
          options={options}
          redraw={true}
        />
      ) : (
        <Bar 
          ref={chartRef}
          data={barData} 
          options={barOptions}
          redraw={true}
        />
      )}
    </div>
  );
};

export default ExpenseChart;