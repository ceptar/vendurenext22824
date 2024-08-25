import { motion } from 'framer-motion'
import React from 'react'
import { FacetValueFilters } from '../facet-filter/FacetValueFilters'

import { easings } from '@components/utils/animations'

const FramerModalOverlay = ({ results, filterIds, setFilterIds }) => {
  // const { data } = results;

  return (
    <motion.div
      className="fixed bottom-0 h-[calc(100vh-5rem)] w-[50vw] top-[5rem] bg-black bg-opacity-85 backdrop-blur-[4px] justify-end p-8 z-50"
      initial={{ x: '-100%' }}
      animate={{
        x: 0,
        transition: { duration: 1, ease: easings.easeOutQuart },
      }}
      exit={{ x: '-100%', transition: { duration: 0.3 } }}
    >
      <motion.div>
        <FacetValueFilters
          results={results} // Use the received results prop
          filterIds={filterIds} // Use the received filterIds prop
          updateFilterIds={setFilterIds} // Use the received setFilterIds function
        />
      </motion.div>
    </motion.div>
  )
}

export default FramerModalOverlay
