import { useEffect, useRef } from "react"
import uPlot, { AlignedData, Options } from "uplot"
import "uplot/dist/uPlot.min.css"

type Props = {
  speed: number
  width?: number
  height?: number
}

const MAX_POINTS = 100

const SpeedGraph = (props: Props) => {
  const { speed, width = 400, height = 220 } = props
  
  const chartRef = useRef<HTMLDivElement | null>(null)
  const uplotRef = useRef<uPlot | null>(null)
  const dataRef = useRef<AlignedData>([[], []])
  
  useEffect(() => {
    if (!chartRef.current) return
    
    const options: Options = {
      width,
      height,
      
      // pxAlign: false, // ? disable pixel alignment tricks
      
      scales: {
        x: { time: true },
        y: { auto: true }
      },
      
      axes: [
        {
          stroke: "#888",
          grid: { stroke: "rgba(255,255,255,0.05)" }
        },
        {
          stroke: "#888",
          grid: { stroke: "rgba(255,255,255,0.05)" }
        }
      ],
      
      series: [
        {},
        {
          label: "Download",
          stroke: "#4f46e5",
          width: 2,
          fill: "rgba(79,70,229,0.3)"
          
          // ? disable fancy path optimizations
          // paths: uPlot.paths!.spline()
        }
      ]
    }
    
    uplotRef.current = new uPlot(options, dataRef.current, chartRef.current)
    
    return () => {
      uplotRef.current?.destroy()
    }
  }, [width, height])
  
  useEffect(() => {
    if (!uplotRef.current) return
    
    const now = Date.now() / 1000
    const timestamps = dataRef.current[0] as number[]
    const speeds = dataRef.current[1] as number[]
    
    timestamps.push(now)
    speeds.push(Number(speed / 1000) || 0) // ? force number
    
    if (timestamps.length > MAX_POINTS) {
      timestamps.shift()
      speeds.shift()
    }
    
    uplotRef.current.setData(dataRef.current)
  }, [speed])
  
  return <div ref={chartRef} />
}

export default SpeedGraph
