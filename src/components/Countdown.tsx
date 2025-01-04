import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeLeft {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isCountingForward, setIsCountingForward] = useState(false)

  useEffect(() => {
    const targetDate = new Date('2025-07-01T00:00:00+09:00') // Tokyo time

    const calculateTime = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        // Counting down
        setIsCountingForward(false)
        setTimeLeft({
          years: 0,
          months: 0,
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        // Counting forward
        setIsCountingForward(true)
        const elapsedTime = Math.abs(difference)
        
        const years = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 365))
        const months = Math.floor((elapsedTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30.44))
        const days = Math.floor((elapsedTime % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24))
        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((elapsedTime / 1000 / 60) % 60)
        const seconds = Math.floor((elapsedTime / 1000) % 60)

        setTimeLeft({ years, months, days, hours, minutes, seconds })
      }
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeBlocks = isCountingForward
    ? [
        { label: 'Years', value: timeLeft.years },
        { label: 'Months', value: timeLeft.months },
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
      ]
    : [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
      ]

  return (
    <div className={`grid ${isCountingForward ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
      {timeBlocks.map(({ label, value }, index) => (
        <motion.div
          key={label}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            className="bg-white/90 rounded-2xl p-4 shadow-lg border border-pink-100/80 relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-50 opacity-50"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.4 }}
            />
            <div className="relative">
              <motion.span 
                className={`block ${isCountingForward ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-bold text-indigo-600 mb-1`}
                key={value}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {value.toString().padStart(2, '0')}
              </motion.span>
              <span className="block text-xs font-medium text-pink-600/80 uppercase tracking-wider">
                {label}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
} 
