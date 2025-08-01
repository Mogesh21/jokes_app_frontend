import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { COLORS } from './ChartConstant';

const Donut = ({ data, filter }) => {
  const [type, setType] = useState([]);
  const [typeValues, setTypeValues] = useState([]);
  const [options, setOptions] = useState({
    colors: COLORS,
    labels: type,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#333',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '28px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#3F4D6E',
              offsetY: 16,
              formatter: function (val, opts) {
                const count = opts.w.globals.series[opts.seriesIndex];
                return count;
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '30px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#3F4D6E',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    if (data) {
      let filteredData = data;
      if (filter !== 'all') {
        filteredData = data.filter((val) => val.availability === filter);
      }
      const typeCounts = filteredData.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
      }, {});
      if (type.length !== 4) {
        const label = ['Laptop/PC', 'Mobile', 'Tab', 'Accessories'];
        label.forEach((val) => {
          if (!typeCounts[val]) {
            typeCounts[val] = 0;
          } 
        });
      }
      setType(Object.keys(typeCounts));
      setOptions({...options, labels: Object.keys(typeCounts)})
      setTypeValues(Object.values(typeCounts));
    }
  }, [data, filter]);

  return <Chart options={options} series={typeValues} height={300} type="donut" />;
};

export default Donut;
