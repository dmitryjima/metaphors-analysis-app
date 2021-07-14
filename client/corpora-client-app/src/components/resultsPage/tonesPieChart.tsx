import React from "react";

import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { articleToneColorSwitch } from "../editionPage/articleRow";

export interface DataInner {
    name: string,
    value: number
}

export interface DataOuter {
    name: string,
    value: number,
    fill?: string,
    fillOpacity?: number
}

interface TonesPieChartProps {
    dataInner: DataInner[],
    dataOuter: DataOuter[]
}

const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];
const data02 = [
    { name: 'A1', value: 100 },
    { name: 'A2', value: 300 },
    { name: 'B1', value: 100 },
    { name: 'B2', value: 80 },
    { name: 'B3', value: 40 },
    { name: 'B4', value: 30 },
    { name: 'B5', value: 50 },
    { name: 'C1', value: 100 },
    { name: 'C2', value: 200 },
    { name: 'D1', value: 150 },
    { name: 'D2', value: 50 },
];

const RADIAN = Math.PI / 180;

interface RenderInnerLabelProps {
    cx: number, 
    cy: number, 
    midAngle: number, 
    innerRadius: number, 
    outerRadius: number, 
    percent: number, 
    index: number 
}
const renderInnerLabel: React.FC<RenderInnerLabelProps> = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index 
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        percent !== 0
        ?
        <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor={'middle'} 
            dominantBaseline="central"
            fontSize=".8rem"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
        :
        null
    );
}


interface RenderOuterLabelProps {
    name: string,
    value: number,
    fill: string,
    cx: number, 
    cy: number, 
    midAngle: number, 
    innerRadius: number, 
    outerRadius: number, 
    percent: number, 
    index: number 
}
const renderOuterLabel: React.FC<RenderOuterLabelProps> = ({ 
    name,
    value,
    fill,
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 3.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        percent !== 0
        ?
        <>
        <text 
            x={x} 
            y={y} 
            fill={fill} 
            textAnchor={'middle'} 
            dominantBaseline="central"
            fontSize=".6rem"
        >
            {name} {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text 
            x={x} 
            y={y + 12} 
            fill={fill} 
            textAnchor={'middle'} 
            dominantBaseline="central"
            fontSize=".6rem"
        >
            ({value})
        </text>
        </>
        :
        null
    );
}

const TonesPieChart: React.FC<TonesPieChartProps> = ({
    dataInner,
    dataOuter
}) => {


    return (
        <PieChart width={350} height={350}>
            <Pie 
                data={dataInner} 
                dataKey="value" 
                cx="50%" 
                cy="50%" 
                outerRadius={60} 
                fill="#8884d8"
                labelLine={false}
                label={renderInnerLabel}
            >
                {
                    dataInner.map((entry, index) => (
                        <Cell 
                            key={`${entry.name}-${index}`}
                            fill={articleToneColorSwitch(entry.name)}
                        />
                    ))
                }
            </Pie>
            <Pie 
                data={dataOuter} 
                dataKey="value" 
                cx="50%" 
                cy="50%" 
                innerRadius={70} 
                outerRadius={90} 
                fill="#82ca9d" 
                label={renderOuterLabel}
            >
                {
                    dataOuter.map((entry, index) => (
                        <Cell 
                            key={`${entry.name}-${index}`}
                            fill={articleToneColorSwitch(entry.fill)}
                            fillOpacity={entry.fillOpacity}
                        />
                    ))
                }
            </Pie>
        </PieChart>
    );
}

export default TonesPieChart;