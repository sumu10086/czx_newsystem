import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
export default function Echart(props) {
  const echartRef = useRef()
  // 1.初始化
  useEffect(() => {
    var myChart = echarts.init(echartRef.current, null, {
      height: 400
    })
    // 2.设置配置项
    let option = {
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none"
          },
          dataView: {
            readOnly: false
          },
          magicType: {
            type: ["line", "bar"]
          },
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {},
      xAxis: {
        type: "category",
        data: Object.keys(props.echartData),
        axisLabel: {
          inside: true,
          color: "#fff"
        },
        z: 10
      },
      yAxis: {
        type: "value",
        minInterval: 1
      },
      series: [
        {
          name: "新闻数据",
          data: Object.values(props.echartData).map((item) => item.length),
          type: "bar",
          showBackground: true,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#83bff6" },
              { offset: 0.5, color: "#188df0" },
              { offset: 1, color: "#188df0" }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#2378f7" },
                { offset: 0.7, color: "#2378f7" },
                { offset: 1, color: "#83bff6" }
              ])
            }
          },
          markPoint: {
            data: [
              {
                type: "max",
                name: "Max"
              },
              {
                type: "min",
                name: "Min"
              }
            ]
          },
          markLine: {
            data: [
              {
                type: "average",
                name: "Avg"
              }
            ]
          }
        }
      ]
    }
    // 3.设置图表绘制图表
    myChart.setOption(option)

    //echarts自适应
    window.onresize = () => {
      myChart.resize()
    }
  }, [props.echartData])

  return (
    <div>
      <h2>各类新闻数量统计</h2>
      <div ref={echartRef}></div>
    </div>
  )
}
