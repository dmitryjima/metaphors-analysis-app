import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';


import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface BarChartMetaphorCase {
    lang: string,
    location: string,
    sourceArticleId: string,
    sourceEditionId: string,
    sourceEditionName: string,
    text: string
}

export interface MetaphorsBarChartDataItem {
    name: string,
    enMetaphors: BarChartMetaphorCase[],
    enMetaphorsNum: number,
    zhMetaphors: BarChartMetaphorCase[],
    zhMetaphorsNum: number,
    ruMetaphors: BarChartMetaphorCase[],
    ruMetaphorsNum: number
}

interface MetaphorsBarChartProps {
    width?: number,
    height?: number,
    data: MetaphorsBarChartDataItem[]
}

const CustomizedAxisTick = (props: any) => {
    const { x, y, stroke, payload } = props;
  
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={`12px`}>
          {payload.value}
        </text>
      </g>
    );
  }

const CustomTooltipStyled = styled.div`
  background-color: #fff9f9;

  padding: 4px 8px 4px 8px;

  border-radius: 4px;

  font-size: .8rem;

  p {
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .customTooltipStyled__item {

  }
`

const CustomTooltip = (props: any) => {
    // Global state & translations
    const { t, i18n } = useTranslation("results");
  
    const { active, payload, label } = props;
  
  
    if (active && payload && payload.length) {
      let payloadToDisplay = payload[0].payload
  
      return (
        <CustomTooltipStyled>
          <p className="label">
            {label}: {
                payloadToDisplay.enMetaphorsNum + payloadToDisplay.zhMetaphorsNum + payloadToDisplay.ruMetaphorsNum
            }
          </p>
          {
            payloadToDisplay.enMetaphorsNum > 0 
            ?
            <div
                style={{
                color: payload[0].color
              }}
            >
                <p>{t(`metaphorsChart.chart.legend.enMetaphorsNum`)}: {payloadToDisplay.enMetaphorsNum}</p>
            </div>
            :
            null
          }
          {
            payloadToDisplay.zhMetaphorsNum > 0 
            ?
            <div
                style={{
                color: payload[1].color
              }}
            >
                <p>{t(`metaphorsChart.chart.legend.zhMetaphorsNum`)}: {payloadToDisplay.zhMetaphorsNum}</p>
            </div>
            :
            null
          }
          {
            payloadToDisplay.ruMetaphorsNum > 0 
            ?
            <div
                style={{
                color: payload[2].color
              }}
            >
                <p>{t(`metaphorsChart.chart.legend.ruMetaphorsNum`)}: {payloadToDisplay.ruMetaphorsNum}</p>
            </div>
            :
            null
          }
        </CustomTooltipStyled>
      );
    }
  
    return null;
};

const MetaphorsBarChart: React.FC<MetaphorsBarChartProps> = ({
    width,
    height,
    data
}) => {
    // Global state & translations
    const { t, i18n } = useTranslation("results");

    const renderLegendContent = (value: string, entry: any) => {  
        const { color } = entry;
      
        return <span style={{ color }}>{t(`metaphorsChart.chart.legend.${value}`)}</span>;
    };

    return (
        <ResponsiveContainer        
            width={width}
            height={height}
        >
            <BarChart
                width={width}
                height={height}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    tick={<CustomizedAxisTick />}
                />
                <YAxis
                    padding={{ top: 20 }}
                    offset={10}
                    allowDecimals={false}
                    label={{ value: t(`metaphorsChart.chart.yAxisLabel`), angle: -90 }}
                />
                <Tooltip 
                    content={CustomTooltip}
                />
                <Legend 
                    formatter={renderLegendContent}
                />
                <Bar dataKey="enMetaphorsNum" stackId="a" fill="#7371fcdc" />
                <Bar dataKey="zhMetaphorsNum" stackId="a" fill="#e87361cc" />
                <Bar dataKey="ruMetaphorsNum" stackId="a" fill="#a1d2cef0" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default MetaphorsBarChart;