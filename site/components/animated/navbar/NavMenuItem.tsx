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
      <div className="flex items-center justify-center relative">
        <motion.div
          className="mix-blend-difference "
       />
        <motion.span
          className="w-4 text-xl sm:text-2xl md:text-3xl "
          variants={itemContentMotion}
        >

          {/* ({index.toLocaleString("en-US", { minimumIntegerDigits: 2 })}) */}
        </motion.span>

        <h1 className="uppercase font-logofont tracking-wide text-3xl sm:text-4xl md:text-5xl flex ">
          {title}
        </h1>
        <motion.div className=""
         variants={arrowMotion}>
          <DiscoLightningInner className="w-8 h-8" />
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-0 h-[2px] bg-secondary w-screen origin-left"
        variants={dividerMotion}
      />
    </motion.li>
  );
};

export default NavMenuItem;
