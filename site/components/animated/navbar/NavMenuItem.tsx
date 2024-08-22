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
      className={`cursor-pointer pl-4 pr-4 py-6 relative w-full items-center ${
        isLoading ? "pointer-events-none" : "pointer-events-auto"
      }`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onAnimationComplete={() => setIsLoading(false)}
    >
      <div className="flex items-center relative w-full">
        <motion.div
          className="absolute left-0 top-0 right-0 bottom-0 mix-blend-difference"
       />
        <motion.span
          className="w-[4ch] text-xl sm:text-2xl md:text-3xl "
          variants={itemContentMotion}
        >
          ({index.toLocaleString("en-US", { minimumIntegerDigits: 2 })})
        </motion.span>
        <h1 className="uppercase tracking-wide text-3xl sm:text-4xl md:text-5xl flex-1 ">
          {title}
        </h1>
        <motion.div variants={arrowMotion}>
          <DiscoLightningInner className="w-12 h-12  " />
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-0 h-[2px] bg-secondary w-[98%] origin-left"
        variants={dividerMotion}
      />
    </motion.li>
  );
};

export default NavMenuItem;
