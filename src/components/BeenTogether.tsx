import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Lottie from 'lottie-react'

// Import cat animations statically
import cuteCat1 from '../assets/cute-cat1.json'
import cuteCat2 from '../assets/cute-cat2.json'
import cuteCat3 from '../assets/cute-cat3.json'
import cuteCat4 from '../assets/cute-cat4.json'
import cuteCat5 from '../assets/cute-cat5.json'
// ... import other cat animations as needed

// Create a map of cat animations
const catAnimations = {
  1: cuteCat1,
  2: cuteCat2,
  3: cuteCat3,
  4: cuteCat4,
  5: cuteCat5,
  // ... add other cat animations
}

// Replace dynamic import with static access
const getCatAnimation = (num: number) => {
  return catAnimations[num as keyof typeof catAnimations] || cuteCat1
}

export function BeenTogether() {
  const [leftCatNum, setLeftCatNum] = useState(1)
  const [rightCatNum, setRightCatNum] = useState(2)
  const [leftCatAnimation, setLeftCatAnimation] = useState(cuteCat1)
  const [rightCatAnimation, setRightCatAnimation] = useState(cuteCat2)
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Load initial cat animations
  useEffect(() => {
    loadCatAnimation(1, 'left')
    loadCatAnimation(2, 'right')
  }, [])

  // Function to load cat animation
  const loadCatAnimation = (num: number, side: 'left' | 'right') => {
    try {
      const animation = getCatAnimation(num)
      if (side === 'left') {
        setLeftCatAnimation(animation)
      } else {
        setRightCatAnimation(animation)
      }
    } catch (error) {
      console.error(`Failed to load cat animation ${num}:`, error)
      // Fallback to default animations if loading fails
      if (side === 'left') {
        setLeftCatAnimation(cuteCat1)
      } else {
        setRightCatAnimation(cuteCat2)
      }
    }
  }

  // Function to change cat animation randomly
  const changeRandomCat = (side: 'left' | 'right') => {
    const maxCats = Object.keys(catAnimations).length
    const randomNum = Math.floor(Math.random() * maxCats) + 1 // Random number between 1 and number of available cats
    if (side === 'left') {
      setLeftCatNum(randomNum)
      loadCatAnimation(randomNum, 'left')
    } else {
      setRightCatNum(randomNum)
      loadCatAnimation(randomNum, 'right')
    }
  }

  useEffect(() => {
    const startDate = new Date('2023-07-20T00:00:00+09:00') // Tokyo time

    const calculateTimeElapsed = () => {
      const now = new Date()
      const difference = now.getTime() - startDate.getTime()

      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365))
      const months = Math.floor((difference / (1000 * 60 * 60 * 24 * 30.44)) % 12)
      const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 30.44)
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeElapsed({ years, months, days, hours, minutes, seconds })
    }

    calculateTimeElapsed()
    const timer = setInterval(calculateTimeElapsed, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeBlocks = [
    { label: 'Years', value: timeElapsed.years },
    { label: 'Months', value: timeElapsed.months },
    { label: 'Days', value: timeElapsed.days },
    { label: 'Hours', value: timeElapsed.hours },
    { label: 'Minutes', value: timeElapsed.minutes },
    { label: 'Seconds', value: timeElapsed.seconds }
  ]

  return (
    <div className="max-w-3xl mx-auto h-full flex items-center px-4 sm:px-6">
      <motion.div 
        className="bg-white/50 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 
                   shadow-xl border border-white/60 w-full"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <motion.div 
          className="text-center mb-8"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 text-transparent bg-clip-text">
            Time We've Shared
          </h2>
          <motion.p 
            className="mt-4 text-xl text-pink-600/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Every second with you is precious 💖
          </motion.p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8">
          <motion.div 
            className="w-28 h-28 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeRandomCat('left')}
          >
            {leftCatAnimation && (
              <Lottie
                animationData={leftCatAnimation}
                loop={true}
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  mixBlendMode: 'multiply'
                }}
              />
            )}
          </motion.div>
          
          <Heart className="w-14 h-14 text-red-500 animate-pulse" />
          
          <motion.div 
            className="w-28 h-28 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeRandomCat('right')}
          >
            {rightCatAnimation && (
              <Lottie
                animationData={rightCatAnimation as any}
                loop={true}
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  mixBlendMode: 'multiply'
                }}
              />
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { label: 'Years', value: timeElapsed.years },
            { label: 'Months', value: timeElapsed.months },
            { label: 'Days', value: timeElapsed.days },
            { label: 'Hours', value: timeElapsed.hours },
            { label: 'Minutes', value: timeElapsed.minutes },
            { label: 'Seconds', value: timeElapsed.seconds }
          ].map(({ label, value }, index) => (
            <motion.div
              key={label}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="bg-white/90 rounded-2xl p-3 shadow-lg border border-pink-100/80 relative overflow-hidden"
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
                    className="block text-2xl md:text-3xl font-bold text-rose-600 mb-1"
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

        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="max-w-[30rem] mx-auto">
            <p className="text-lg text-pink-600/90 font-medium italic break-words whitespace-pre-wrap">
              "Koko is always here—to love you, care for you, and support you unconditionally." 
            </p>
          </div>
          <div className="flex justify-center space-x-2 text-2xl">
            <motion.span 
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="cursor-pointer"
            >
              🐱
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.2, rotate: -10 }}
              className="cursor-pointer"
            >
              💞
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="cursor-pointer"
            >
              🐈
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 