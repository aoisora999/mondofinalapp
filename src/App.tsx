import './App.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import Lottie from 'lottie-react'
import { Countdown } from './components/Countdown'
import { BeenTogether } from './components/BeenTogether'
import planeAnimation from './assets/plane-animation.json'
import { useState, useEffect } from 'react'
import { SweetNotes } from './components/SweetNotes'
import { BucketList } from './components/BucketList'
import { PinModal } from './components/PinModal'
import { initializeSecuritySettings } from './firebase/config'

function App() {
  useEffect(() => {
    initializeSecuritySettings()
  }, [])

  const [currentPage, setCurrentPage] = useState<'countdown' | 'together' | 'notes' | 'bucket'>('countdown')
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<'notes' | 'bucket' | null>(null)
  const [isPinVerified, setIsPinVerified] = useState(false)

  const handleNavigationClick = (page: 'countdown' | 'together' | 'notes' | 'bucket') => {
    if ((page === 'notes' || page === 'bucket') && !isPinVerified) {
      setIsPinModalOpen(true)
      setPendingNavigation(page)
    } else {
      setCurrentPage(page)
    }
  }

  const handlePinSuccess = () => {
    setIsPinVerified(true)
    if (pendingNavigation) {
      setCurrentPage(pendingNavigation)
      setPendingNavigation(null)
    }
    setIsPinModalOpen(false)
  }

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentPage === 'countdown' ? (
          <motion.div 
            key="countdown"
            className="min-h-screen p-2 md:p-4 relative"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <motion.div className="max-w-3xl mx-auto">
              <motion.div 
                className="bg-white/50 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-xl border border-white/60"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <motion.div 
                  className="text-center mb-4"
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="inline-block"
                  >
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                      Our Next Chapter
                    </h1>
                  </motion.div>
                  <motion.p 
                    className="mt-4 text-xl text-indigo-600/80 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Counting down to our magical moment in Tokyo 🗼✨
                  </motion.p>
                </motion.div>

                <div className="flex justify-center mb-4">
                  <Heart className="w-12 h-12 text-red-500 animate-pulse" />
                </div>

                <Countdown />

                <motion.div 
                  className="mt-6 text-center space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="max-w-[30rem] mx-auto">
                    <p className="text-lg text-pink-600/90 font-medium italic break-words whitespace-pre-wrap">
                      "Every second brings us closer, until we're in each other's arms" 
                    </p>
                  </div>
                  <div className="flex justify-center space-x-2 text-2xl">
                    <motion.span 
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="cursor-pointer"
                    >
                      🌸
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      className="cursor-pointer"
                    >
                      💕
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="cursor-pointer"
                    >
                      ✈️
                    </motion.span>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-4 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
                  <Lottie
                    animationData={planeAnimation}
                    className="w-full max-w-[200px] mx-auto"
                    loop={true}
                    style={{ 
                      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                      mixBlendMode: 'multiply'
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.button
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full 
                         bg-white/80 text-pink-500 shadow-lg border border-pink-100/50
                         hover:bg-white hover:shadow-xl transition-all"
              onClick={() => handleNavigationClick('together')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Our Story ❤️
            </motion.button>
          </motion.div>
        ) : currentPage === 'together' ? (
          <motion.div 
            key="together"
            className="min-h-screen p-2 md:p-4 relative"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <BeenTogether />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <motion.button
                className="px-6 py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                          border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all"
                onClick={() => handleNavigationClick('countdown')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Countdown 🕒
              </motion.button>
              <motion.button
                className="px-6 py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                          border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all"
                onClick={() => handleNavigationClick('notes')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Notes 💌
              </motion.button>
            </div>
          </motion.div>
        ) : currentPage === 'notes' ? (
          <motion.div 
            key="notes"
            className="min-h-screen p-2 md:p-4 relative"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <SweetNotes />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <motion.button
                className="px-6 py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                          border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all"
                onClick={() => handleNavigationClick('together')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Our Story ❤️
              </motion.button>
              <motion.button
                className="px-6 py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                          border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all"
                onClick={() => handleNavigationClick('bucket')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Bucket List ⭐
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="bucket"
            className="min-h-screen p-2 md:p-4 relative"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <BucketList />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <motion.button
                className="px-6 py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                          border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all"
                onClick={() => handleNavigationClick('notes')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Our Notes 💌
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false)
          setPendingNavigation(null)
        }}
        onSuccess={handlePinSuccess}
      />

      <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 flex justify-center 
                gap-2 sm:gap-4 px-4 z-10">
        <motion.button
          className="px-3 sm:px-6 py-2 text-sm sm:text-base rounded-full 
                     bg-white/80 text-pink-500 shadow-lg"
        >
          {/* ... */}
        </motion.button>
      </div>
    </div>
  )
}

export default App
