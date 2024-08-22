import { motion } from "framer-motion";
import React, { useState } from "react";

import DiscoLightningInner from "@components/icons/DiscoLightningInner";
import {
  arrowMotion,
  dividerMotion,
  itemContentMotion,
} from "@components/utils/animations";

interface NavMenuItem {
  index: number;
  title: string;
}

const NavMenuItem: React.FC<NavMenuItem> = ({ index, title }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.li
      className={`cursor-pointer py-6 relative items-center ${
        isLoading ? "pointer-events-none" : "pointer-events-auto"
      }`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onAnimationComplete={() => setIsLoading(false)}
    >
      <div className="flex items-center relative">
        <motion.div
          className="mix-blend-difference "
       />
        <motion.span
          className="w-[4ch] text-xl sm:text-2xl md:text-3xl "
          variants={itemContentMotion}
        >

          {/* ({index.toLocaleString("en-US", { minimumIntegerDigits: 2 })}) */}
        </motion.span>
        <motion.div variants={arrowMotion}>
          <DiscoLightningInner className="w-8 h-8" />
        </motion.div>
        <h1 className="uppercase font-logofont tracking-wide text-4xl sm:text-5xl md:text-6xl flex-1 ">
          {title}
        </h1>

      </div>
      <motion.div
        className="absolute bottom-0 h-[2px] bg-secondary w-screen origin-left"
        variants={dividerMotion}
      />
    </motion.li>
  );
};

export default NavMenuItem;
