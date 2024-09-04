import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavMenuItem from './NavMenuItem';
import s from './animated-navbar.module.css';

interface TreeNode {
  id: string | number;
  name: string;
  isParent: boolean;
  isChild: boolean;
  children?: TreeNode[];
  slug: string;
}

interface RootNode<T> {
  children: T[];
}

type NavMenuProps = {
  treeData: RootNode<TreeNode>;
};
const TreeMenuItem: React.FC<{ node: TreeNode; index: number; onToggle: (id: string) => void; isOpen: boolean }> = ({
  node,
  index,
  onToggle,
  isOpen,
}) => {
  const className = node.isParent ? s.parent : node.isChild ? s.child : '';

  const handleClick = () => {
    onToggle(node.id);
  };

  return (
    <div>
      <div className={className} onClick={handleClick}>
        <NavMenuItem index={index} title={node.name} />
      </div>
      {node.children && node.children.length > 0 && (
        <motion.ul
          initial={{ height: 0 }}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className={s.subMenu}
        >
          {node.children.map((child, childIdx) => (
            <a key={child.id} href={`/collection/${child.slug}`}
>
            <TreeMenuItem
              key={child.id}
              node={child}
              index={childIdx + 1}
              onToggle={onToggle}
              isOpen={isOpen}
            />
            </a>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default TreeMenuItem;