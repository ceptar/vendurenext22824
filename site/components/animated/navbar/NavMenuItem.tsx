import { motion } from 'framer-motion'
import s from './animated-navbar.module.css'
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
      <motion.div className={s.menuItem}>
        <motion.div 
        className="" 
        // className="mix-blend-difference "
         />
        {/* <motion.span
          className="w-2"
          variants={itemContentMotion}
        >
          ({index.toLocaleString("en-US", { minimumIntegerDigits: 2 })}) 
        </motion.span> */}

        <h1 className="font-fw500 uppercase tracking-wide text-primary flex">
          {title}
          </h1>
        <motion.div variants={arrowMotion}>
          <DiscoLightningOuter className="p-2 w-10 h-10" />
        </motion.div>
      </motion.div>
      {/* <motion.div
        className="absolute bottom-0 h-[2px] bg-secondary w-screen origin-left"
        variants={dividerMotion}
      /> */}
    </motion.div>
  )
}

export default NavMenuItem
