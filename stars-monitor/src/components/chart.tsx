"use client";
import {Repository} from "@prisma/client";
import {useMemo} from "react";
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ChartComponent({repository}: {repository: Repository[]}) {
    const labels = useMemo(() => {
        return repository.map(r => `${r.year}/${r.month}`);
    }, [repository]);

    const data = useMemo(() => ({
        labels,
        datasets: [
            {
                label: repository[0].name,
                data: repository.map(p => p.stars),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.2,
            },
        ],
    }), [repository]);

    return (
        <Line options={{
            responsive: true,
        }} data={data} />
    );
}