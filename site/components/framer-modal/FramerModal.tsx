import React from 'react'
import FramerModalToggle from './FramerModalToggle'
import { AnimatePresence, motion } from 'framer-motion'
import FramerModalOverlay from './FramerModalOverlay'

// Define the expected props interface
interface FramerModalProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  results: any // Replace 'any' with the correct type if known
  filterIds: string[]
  setFilterIds: (ids: string[]) => void
}

const FramerModal: React.FC<FramerModalProps> = ({
  menuOpen,
  setMenuOpen,
  results,
  filterIds,
  setFilterIds,
}) => {
  return (
    <div>
      <AnimatePresence>
        {menuOpen && (
          <FramerModalOverlay
            results={results} // Access the received results prop
            filterIds={filterIds} // Access the received filterIds prop
            setFilterIds={setFilterIds} // Access the received setFilterIds function
          />
        )}
      </AnimatePresence>

      <div className="p-1 mix-blend-difference z-[100] fixed bottom-0 right-0 mr-4 mb-8 ">
        <FramerModalToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
    </div>
  )
}

export default FramerModal
