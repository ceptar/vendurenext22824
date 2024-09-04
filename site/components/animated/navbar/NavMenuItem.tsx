import { motion } from 'framer-motion'
import React, { useState } from 'react'

import DiscoLightningOuter from '@components/icons/DiscoLightningOuter'
import {
  arrowMotion,
  dividerMotion,
  itemContentMotion,
} from '@components/utils/animations'

interface NavMenuItem {
  index: number
  title: string
}

const NavMenuItem: React.FC<NavMenuItem> = ({ index, title }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <motion.div

      className={`cursor-pointer relative items-center ${
        isLoading ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onAnimationComplete={() => setIsLoading(false)}
    >
      <motion.div className="flex py-2 items-center justify-start relative">
        <motion.div 
        // className="mix-blend-difference "
         />
        {/* <motion.span
          className="w-2"
          variants={itemContentMotion}
        >
          ({index.toLocaleString("en-US", { minimumIntegerDigits: 2 })}) 
        </motion.span> */}

        <h1 className="font-logofont text-primary flex ">
          {title}
          </h1>
        <motion.div variants={arrowMotion}>
          <DiscoLightningOuter className="pl-2 w-8 h-8" />
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute bottom-0 h-[2px] bg-secondary w-screen origin-left"
        variants={dividerMotion}
      />
    </motion.div>
  )
}

export default NavMenuItem
