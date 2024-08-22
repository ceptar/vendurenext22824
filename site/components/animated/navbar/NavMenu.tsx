import { motion } from "framer-motion";
import React from "react";
import { easings } from "@components/utils/animations";
import NavMenuItem from "./NavMenuItem";

interface TreeNode {
  id: string | number;
  name: string;
  children?: TreeNode[];
}

const TreeMenuItem: React.FC<{ node: TreeNode; index: number | string }> = ({ node, index }) => {
  return (
    <li>
      <NavMenuItem index={index} title={node.name} />
      {node.children && node.children.length > 0 && (
        <motion.ul>
          {node.children.map((child, childIdx) => (
            <TreeMenuItem key={child.id} node={child} index={`${index}.${childIdx + 1}`} />
          ))}
        </motion.ul>
      )}
    </li>
  );
};

const NavMenu = ({ treeData }) => {
  if (!treeData || !Array.isArray(treeData.children)) {
    return null;  // Handle cases where treeData is not structured as expected
  }

  return (

    <motion.div
      className="absolute h-[calc(screen-80px)] top-[52px] w-screen bg-primary opacity-90 backdrop-blur-md flex flex-col justify-end z-50"
      initial={{ x: "-100%" }}
      animate={{
        x: 0,
        transition: { duration: 1, ease: easings.easeOutQuart },
      }}
      exit={{ x: "-100%", transition: { duration: 0.3 } }}
    >
      <motion.ul className="" exit={{ opacity: 0, transition: { duration: 0 } }}>
        {treeData.children.map((node, idx) => (
          <TreeMenuItem key={node.id} node={node} index={idx + 1} />
        ))}
      </motion.ul>
    </motion.div>

  );
};

export default NavMenu