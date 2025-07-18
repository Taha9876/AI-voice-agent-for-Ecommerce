"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface VoiceVisualizerProps {
  isActive: boolean
  className?: string
}

export function VoiceVisualizer({ isActive, className }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)

      if (isActive) {
        const bars = 20
        const barWidth = width / bars

        for (let i = 0; i < bars; i++) {
          const barHeight = Math.random() * height * 0.8 + height * 0.1
          const x = i * barWidth
          const y = (height - barHeight) / 2

          ctx.fillStyle = `hsl(${200 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`
          ctx.fillRect(x, y, barWidth - 2, barHeight)
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  return <canvas ref={canvasRef} width={300} height={100} className={cn("border rounded-lg bg-slate-50", className)} />
}
