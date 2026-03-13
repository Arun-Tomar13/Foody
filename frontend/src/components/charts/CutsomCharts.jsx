import {
  Chart,
  Series,
  Subtitle,
  Title,
  XAxis,
  YAxis,
} from "@highcharts/react";

const CutsomCharts = ({
  title,
  subtitle,
  data,
  total = {},
  xName = "",
  xData = {},
  yName = "",
  yData = {},
  type,
  name,
  props = {},
}) => {
  // console.log("1");

  // if (type === "line") {
  //   console.log("data in line 1", data);
  //   console.log("data in line  2 ", xData);
  //   console.log("data in line  3", yData);
  // }

  return (
    <Chart>
      <Title>{title}</Title>
      <Subtitle>
        {subtitle} {total}
      </Subtitle>
      <XAxis categories={xData}>{xName}</XAxis>
      <YAxis categories={yData}>{yName}</YAxis>
      {data.map((item, index) => {
        return (
          <Series type={type} data={item.data} name={item.name} key={index} />
        );
      })}
    </Chart>
  );
};

export default CutsomCharts;
