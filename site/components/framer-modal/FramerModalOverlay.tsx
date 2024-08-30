import { motion } from 'framer-motion'
import React from 'react'
import { FacetValueFilters } from '../facet-filter/FacetValueFilters'
import { easings } from '@components/utils/animations'

// Define the types for the props
interface FramerModalOverlayProps {
  results: any // Replace 'any' with the correct type if known
  filterIds: string[]
  setFilterIds: (ids: string[]) => void
}

const FramerModalOverlay: React.FC<FramerModalOverlayProps> = ({ results, filterIds, setFilterIds }) => {
  // const { data } = results;

  return (
    <motion.div
      className="fixed bottom-0 right-[80px] bg-primary justify-end z-50"
      initial={{ y: '100%' }}
      animate={{
        y: 0,
        transition: { duration: 1, ease: easings.easeOutQuart },
      }}
      exit={{ y: '100%', transition: { duration: 0.3 } }}
    >
      <div className="border-[8px] border-secondary">
      <motion.div>
        <FacetValueFilters
          results={results} // Use the received results prop
          filterIds={filterIds} // Use the received filterIds prop
          updateFilterIds={setFilterIds} // Use the received setFilterIds function
        />
      </motion.div>
      </div>
    </motion.div>

  )
}

export default FramerModalOverlay
