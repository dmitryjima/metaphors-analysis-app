import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface ArticleLineChartDataItem {
  period: string,
  enNumArticles?: number,
  enNumMetaphors?: number,
  zhNumArticles?: number,
  zhNumMetaphors?: number,
  ruNumArticles?: number,
  ruNumMetaphors?: number,
}


const CustomizedAxisTick = (props: any) => {
  const { x, y, stroke, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize={`12px`}>
        {payload.value}
      </text>
    </g>
  );
}

const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, dataKey, value, color } = props;

  let numMetaphors = props.payload[`${dataKey.slice(0, 2)}NumMetaphors`]

  if (numMetaphors > 0) {
    return (
      <svg x={cx - 6} y={cy - 6} width={12} height={12} fill={color} viewBox="0 0 1024 1024">
        <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248 s32.032 73.248 " />
      </svg>
    );
  }

  return null
};

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
        <p className="label">{label}</p>
        <div
          className="customTooltipStyled__item"
          style={{
            color: payload[0].color
          }}
        >
          <p>{t(`articlesChart.chart.legend.enNumArticles`)}: {payloadToDisplay.enNumArticles}</p>
          {
            payloadToDisplay.enNumMetaphors > 0
            ?
            <p
              style={{
                paddingLeft: '.5rem'
              }}
            >
              {t(`articlesChart.chart.legend.numMetaphors`)}: {payloadToDisplay.enNumMetaphors}
            </p>
            :
            null
          }
        </div>
        <div
          className="customTooltipStyled__item"
          style={{
            color: payload[1].color
          }}
        >
          <p>{t(`articlesChart.chart.legend.zhNumArticles`)}: {payloadToDisplay.zhNumArticles}</p>
          {
            payloadToDisplay.zhNumMetaphors > 0
            ?
            <p
              style={{
                paddingLeft: '.5rem'
              }}
            >
              {t(`articlesChart.chart.legend.numMetaphors`)}: {payloadToDisplay.zhNumMetaphors}
            </p>
            :
            null
          }
        </div>
        <div
          className="customTooltipStyled__item"
          style={{
            color: payload[2].color
          }}
        >
          <p>{t(`articlesChart.chart.legend.ruNumArticles`)}: {payloadToDisplay.ruNumArticles}</p>
          {
            payloadToDisplay.ruNumMetaphors > 0
            ?
            <p
              style={{
                paddingLeft: '.5rem'
              }}
            >
              {t(`articlesChart.chart.legend.numMetaphors`)}: {payloadToDisplay.ruNumMetaphors}
            </p>
            :
            null
          }
        </div>
      </CustomTooltipStyled>
    );
  }

  return null;
};


interface ArticlesLineChartProps {
  width?: number,
  height?: number,
  data: ArticleLineChartDataItem[]
}

const ArticlesLineChart: React.FC<ArticlesLineChartProps> = ({
  width = 500,
  height = 300,
  data
}) => {
  // Global state & translations
  const { t, i18n } = useTranslation("results");


  const renderLegendContent = (value: string, entry: any) => {  
    const { color } = entry;
  
    return <span style={{ color }}>{t(`articlesChart.chart.legend.${value}`)}</span>;
  };

  return (
    <ResponsiveContainer        
      width={width}
      height={height}
    >
      <LineChart
        width={width}
        height={height}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={({ period }) => {
            return new Date(period).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short'})
          }}
          tick={<CustomizedAxisTick />}
        />
        <YAxis 
          padding={{ top: 20 }}
          allowDecimals={false}
          label={{ value: t(`articlesChart.chart.yAxisLabel`), angle: -90 }}
        />
        <Tooltip 
          content={CustomTooltip}
        />
        <Legend 
          formatter={renderLegendContent}
        />
        <Line 
          type="monotone" 
          dataKey="enNumArticles" 
          stroke="#2244b6" 
          strokeWidth={width > 500 ? 3 : 2}
          dot={
            <CustomizedDot
              color={`#2244b6`}
            />
          } 
        />
        <Line 
          type="monotone" 
          dataKey="zhNumArticles" 
          stroke="#c0342a" 
          strokeWidth={width > 500 ? 3 : 2}
          dot={
            <CustomizedDot
              color={`#c0342a`}
            />
          } 
        />
        <Line 
          type="monotone" 
          dataKey="ruNumArticles" 
          stroke="#3ea04b" 
          strokeWidth={width > 500 ? 3 : 2}
          dot={
            <CustomizedDot
              color={`#3ea04b`}
            />
          } 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ArticlesLineChart