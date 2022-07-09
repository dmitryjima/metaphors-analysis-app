import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';


import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChartMetaphorCase } from './metaphorsBarChart';

export interface MetaphorsBarChartDataItemByCountry {
    name: string,
    color: string,
    lang: string,
    metaphors: BarChartMetaphorCase[],
    metaphorsNum: number
}

interface MetaphorsBarChartProps {
    width?: number,
    height?: number,
    data: MetaphorsBarChartDataItemByCountry[][]
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
            {label}: {payloadToDisplay.metaphorsNum}
          </p>
        </CustomTooltipStyled>
      );
    }
  
    return null;
};

const MetaphorsBarChartByCountry: React.FC<MetaphorsBarChartProps> = ({
    width,
    height,
    data
}) => {
    // Global state & translations
    const { t, i18n } = useTranslation("results");

    const renderLegendContent = (country: string) => (value: string, entry: any) => {  
        const { color } = entry;
     
        return <span style={{ color }}>{t(`metaphorsChart.chart.legend.${country}MetaphorsNum`)}</span>;
    };

    return (
      <>
        {
          data && data.map((countryData:MetaphorsBarChartDataItemByCountry[], index) => (
          <ResponsiveContainer        
            width={width}
            height={height}
            key={index}
          >
              <BarChart
                  width={width}
                  height={height}
                  data={countryData}
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
                      allowDecimals={false}
                      label={{ value: t(`metaphorsChart.chart.yAxisLabel`), angle: -90 }}
                  />
                  <Tooltip 
                      content={CustomTooltip}
                  />
                  <Legend 
                      formatter={renderLegendContent(countryData[0].lang)}
                  />
                  <Bar dataKey={`metaphorsNum`} stackId="a" fill={countryData[0].color} />
              </BarChart>
          </ResponsiveContainer>
          ))
        }
      </>
    );
}

export default MetaphorsBarChartByCountry;