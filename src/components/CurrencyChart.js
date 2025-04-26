'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function CurrencyChart({ currency, historicalData, isLoading, error }) {
    if (isLoading) {
        return <div className="text-center p-4 text-gray-600">Loading historical data...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">Error loading historical data. Please try again later.</div>;
    }

    if (!historicalData || !historicalData.length) {
        return <div className="text-center p-4 text-gray-600">No historical data available.</div>;
    }

    const data = {
        labels: historicalData.map(item => item.date),
        datasets: [
            {
                label: `${currency}`,
                data: historicalData.map(item => item.rate),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Historical AUD/${currency} Exchange Rate`
            }
        }
    };

    return (
        <div className="w-full h-96 p-4 flex items-center justify-center">
            <div className="w-full h-full">
                <Line data={data} options={options} />
            </div>
        </div>
    );
} 