import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Trash2, Star, Pencil, X } from 'lucide-react'
import { useLongPress } from 'use-long-press'
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

interface BucketItem {
  id: string
  content: string
  completed: boolean
  date: string
}

export function BucketList() {
  const [items, setItems] = useState<BucketItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'bucketList'), orderBy('timestamp', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      })) as BucketItem[]
      
      setItems(itemsData)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedItem) {
        const target = event.target as HTMLElement
        if (!target.closest('.item-menu') && !target.closest('.item-content')) {
          setSelectedItem(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedItem])

  const bind = useLongPress((event, { context }) => {
    const itemId = context as string
    setSelectedItem(itemId)
  }, {
    threshold: 500,
    cancelOnMovement: true
  })

  const handleEdit = (item: BucketItem) => {
    setEditingItem(item.id)
    setEditContent(item.content)
    setSelectedItem(null)
  }

  const saveEdit = async () => {
    if (editingItem && editContent.trim()) {
      try {
        await updateDoc(doc(db, 'bucketList', editingItem), {
          content: editContent.trim()
        })
        setEditingItem(null)
        setEditContent('')
      } catch (error) {
        console.error('Error updating item:', error)
      }
    }
  }

  const addItem = async () => {
    if (newItem.trim()) {
      try {
        await addDoc(collection(db, 'bucketList'), {
          content: newItem.trim(),
          completed: false,
          timestamp: new Date().toISOString()
        })
        setNewItem('')
      } catch (error) {
        console.error('Error adding item:', error)
      }
    }
  }

  const toggleComplete = async (id: string) => {
    try {
      const itemRef = doc(db, 'bucketList', id)
      const item = items.find(i => i.id === id)
      if (item) {
        await updateDoc(itemRef, {
          completed: !item.completed
        })
      }
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bucketList', id))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="bg-white/50 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-xl border border-white/60"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <motion.div 
          className="text-center mb-8"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
            Our Bucket List
          </h2>
          <motion.p 
            className="mt-4 text-xl text-purple-600/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Dreams we'll achieve together ⭐
          </motion.p>
        </motion.div>

        {/* New Item Input */}
        <div className="mb-8">
          <div className="relative">
            <textarea
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  addItem()
                }
              }}
              placeholder="Add a new dream to our list..."
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-purple-100 
                       focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                       placeholder-purple-300 text-purple-600 resize-none h-20"
              style={{ 
                maxWidth: '30rem',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
            <motion.button
              onClick={addItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-3 right-3 p-2 rounded-full 
                       bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              <Plus size={20} />
            </motion.button>
          </div>
        </div>

        {/* Bucket List Items */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
              {...bind(item.id)}
            >
              <motion.div
                className="item-content bg-white/90 rounded-xl p-4 shadow-md border border-purple-100"
                style={{ maxWidth: '30rem' }}
              >
                <div className="flex items-start gap-3">
                  <motion.button
                    onClick={() => toggleComplete(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-1 rounded-full ${
                      item.completed 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white text-purple-500 border-2 border-purple-500'
                    }`}
                  >
                    {item.completed ? <Check size={16} /> : <Star size={16} />}
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    {editingItem === item.id ? (
                      <div className="relative">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/80 border border-purple-100 
                                   focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                                   text-purple-600 resize-none h-20"
                          style={{ maxWidth: '100%' }}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <motion.button
                            onClick={() => setEditingItem(null)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 rounded-full bg-gray-100 text-gray-500"
                          >
                            <X size={16} />
                          </motion.button>
                          <motion.button
                            onClick={saveEdit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 rounded-full bg-purple-500 text-white"
                          >
                            <Check size={16} />
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={`text-purple-600 break-words whitespace-pre-wrap text-justify
                                     ${item.completed ? 'line-through opacity-70' : ''}`}
                           style={{
                             wordBreak: 'break-word',
                             overflowWrap: 'break-word'
                           }}>
                          {item.content}
                        </p>
                        <span className="text-sm text-purple-400">{item.date}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Context Menu */}
              <AnimatePresence>
                {selectedItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="item-menu absolute right-2 top-2 flex gap-1 bg-white/90 
                             rounded-full shadow-lg border border-purple-100 p-1"
                  >
                    <motion.button
                      onClick={() => handleEdit(item)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-purple-500 text-white
                               hover:bg-purple-600 transition-colors"
                    >
                      <Pencil size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteItem(item.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-purple-500 text-white
                               hover:bg-purple-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 