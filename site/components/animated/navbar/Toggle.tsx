import React from 'react';
import { motion } from "framer-motion";

const Path = (props: React.SVGProps<SVGPathElement>) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }: { toggle: () => void }) => {
  const path1Variants = React.useMemo(() => ({
    closed: { d: "M 2 2.5 L 20 2.5" },
    open: { d: "M 3 16.5 L 17 2.5" }
  }), []);

  const path2Variants = React.useMemo(() => ({
    closed: { d: "M 2 16.346 L 20 16.346" },
    open: { d: "M 3 2.5 L 17 16.346" }
  }), []);

  return (
    <div className="flex pr-6 items-center">
      <button onClick={toggle}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <Path variants={path1Variants} />
          <Path
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            transition={{ duration: 0.1 }}
          />
          <Path variants={path2Variants} />
        </svg>
      </button>
    </div>
  );
};