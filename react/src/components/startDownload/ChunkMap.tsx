import { useEffect, useState } from "react"
import styles from "./style.module.scss"

type Props = {
  percent: number
  width?: string
  gridTemp?: string
}

const ChunkMap = (props: Props) => {
  const { percent, width, gridTemp } = props
  const [chunks, setChunks] = useState<boolean[]>(Array(100).fill(false))
  const [animatingIndexes, setAnimatingIndexes] = useState<number[]>([])

  useEffect(() => {
    const targetCount = Math.floor(percent)

    setChunks((prev) => {
      const currentCount = prev.filter(Boolean).length
      if (targetCount <= currentCount) return prev
      
      const newChunks = [...prev]
      const emptyIndexes = newChunks.map((val, idx) => (!val ? idx : -1)).filter((idx) => idx !== -1)

      const toActivate = targetCount - currentCount
      const activated: number[] = []
      
      for (let i = 0; i < toActivate; i++) {
        const randomIndex = Math.floor(Math.random() * emptyIndexes.length)
        const selected = emptyIndexes[randomIndex]
        
        newChunks[selected] = true
        activated.push(selected)
        emptyIndexes.splice(randomIndex, 1)
      }
      
      // trigger animation
      setAnimatingIndexes(activated)
      
      // remove animation flag after animation
      setTimeout(() => setAnimatingIndexes([]), 400)
      
      return newChunks
    })
  }, [percent])
  
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridTemp ? gridTemp : "repeat(10, 1fr)",
        gap: "4px",
        width: width ? width : "200px",
        border: "1px solid #2e2e2e",
        borderRadius: "8px",
        padding: "5px"
      }}
    >
      {chunks.map((filled, index) => {
        const isAnimating = animatingIndexes.includes(index)
        
        return (
          <div
            key={index}
            className={styles.chunkGridItem}
            style={{
              width: "100%",
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              aspectRatio: "1",
              background: filled ? "linear-gradient(45deg, #094F5E, #196475, #0CF01F,#456954)" : "#2e2e2e",
              border: "1px solid #2e2e2e",
              borderRadius: "3px",
              transform: isAnimating ? "scale(1.2)" : "scale(1)",
              // boxShadow: isAnimating
              //   ? "0 0 12px #4caf50"
              //   : "none",
              boxShadow: isAnimating ? "0 0 6px red" : "none",
              transition: "all 100ms ease"
            }}
          />
        )
      })}
    </div>
  )
}

export default ChunkMap
