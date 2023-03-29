import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
export default function Echart(props) {
  const echartRef = useRef()
  // 1.初始化
  useEffect(() => {
    let dataAll = []
    for (const key in props.echartData) {
      dataAll.push({
        name: key,
        value: props.echartData[key].length
      })
    }
    var myChart = echarts.init(echartRef.current)
    // 2.设置配置项

    let option = {
      title: {
        text: "发布的新闻",
        subtext: "Fake Data",
        left: "center"
      },
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "left"
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          type: "pie",
          data: dataAll,
          radius: [60, 180],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 8
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
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
    <div
      ref={echartRef}
      style={{
        display: "flex",
        justifyContent: "center",
        height: "500px",
        marginTop: "50px"
      }}
    ></div>
  )
}
