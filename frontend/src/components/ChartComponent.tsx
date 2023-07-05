import React, { useEffect, useRef } from 'react';
import Chart, { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

interface ChartProps {
    data: { date: string; amount: number }[];
}

const ChartComponent: React.FC<ChartProps> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map(entry => entry.date),
                        datasets: [
                            {
                                label: 'Amount',
                                data: data.map(entry => entry.amount),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    parser: 'ddTHH:mm',
                                    tooltipFormat: 'MMM d, yyyy HH:mm',
                                    unit: 'minute',
                                    displayFormats: {
                                        minute: 'MMM d HH:mm',
                                        hour: 'MMM d HH:mm',
                                        day: 'MMM d, yyyy',
                                    },
                                },
                            },
                            y: {
                                beginAtZero: true,
                            },
                        } as ChartOptions['scales'], // Define the type explicitly
                    },
                });

                return () => {
                    chart.destroy();
                };
            }
        }
    }, [data]);

    return (
        <div >
            <canvas ref={chartRef} style={{ width: '500px' }} />
        </div>
    );
};

export default ChartComponent;
