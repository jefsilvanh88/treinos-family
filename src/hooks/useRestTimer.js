import { useState, useEffect, useRef, useCallback } from 'react'

export function useRestTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const targetRef = useRef(0)

  const beep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const frequencies = [880, 1100, 880]
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = ctx.currentTime + i * 0.18
        gain.gain.setValueAtTime(0.4, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
        osc.start(t)
        osc.stop(t + 0.15)
      })
    } catch (_) {}
  }, [])

  const start = useCallback((totalSeconds) => {
    targetRef.current = totalSeconds
    setSeconds(totalSeconds)
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    setSeconds(0)
    clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          beep()
          if (navigator.vibrate) navigator.vibrate([200, 100, 200])
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, beep])

  const progress = targetRef.current > 0 ? 1 - seconds / targetRef.current : 0

  return { seconds, running, progress, start, stop }
}
