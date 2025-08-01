import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { COLORS } from './ChartConstant';

const BasicBar = ({ data }) => {
  const [series, setSeries] = useState([
    {
      name: '',
      data: []
    }
  ]);

  const [options, setOptions] = useState({
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%'
      }
    },
    colors: COLORS,
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val) => val
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}`
      }
    }
  });

  useEffect(() => {
    const designationData = data.reduce((acc, curr) => {
      acc[curr.designation] = (acc[curr.designation] || 0) + 1;
      return acc;
    }, {});
    setSeries([{ name: 'Total', data: Object.values(designationData) }]);
    setOptions({ ...options, labels: Object.keys(designationData), xaxis: { categories: Object.keys(designationData) } });
  }, [data]);

  return <Chart options={options} series={series} type="bar" height={300} />;
};

export default BasicBar;
