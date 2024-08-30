import React from 'react'
import s from './animated-navbar.module.css'
import { motion } from 'framer-motion'
import { easings } from '@components/utils/animations'
import NavMenuItem from './NavMenuItem'

// Adjusted TreeNode interface to match the usage
interface TreeNode {
  id: string | number
  name: string
  isParent: boolean
  isChild: boolean
  children?: TreeNode[]
  slug: string
}

interface RootNode<T> {
  children: T[]
}

type NavMenuProps = {
  treeData: RootNode<TreeNode>
}

const TreeMenuItem: React.FC<{ node: TreeNode; index: number }> = ({
  node,
  index,
}) => {
  const className = node.isParent ? s.parent : node.isChild ? s.child : ''

  console.log(`Rendering TreeMenuItem: ${node.name}`, node) // Logging each node

  return (
    <div >
      <div className={className}>
      <NavMenuItem index={index} title={node.name} />
      </div>
      {node.children && node.children.length > 0 && (
        <motion.ul >
          {node.children.map((child, childIdx) => (
          <a key={childIdx} href={`/collection/${child.slug}`} className={className}>
            <TreeMenuItem key={child.id} node={child} index={childIdx + 1} />
          </a>
          ))}
        </motion.ul>
      )}
    </div>
  )
}

const NavMenu: React.FC<NavMenuProps> = ({ treeData }) => {
  if (!treeData || !Array.isArray(treeData.children)) {
    console.error('Invalid treeData:', treeData)
    return null
  }

  console.log('Rendering NavMenu with treeData:', treeData) // Log the entire tree data

  return (
    <motion.div

      className="absolute top-[80px] pt-4 w-screen flex flex-col bg-secondary opacity-85 backdrop-blur-md justify-start z-50"
      initial={{ x: '-100%' }}
      animate={{
        x: 0,
        transition: { duration: 1, ease: easings.easeOutQuart },
      }}
      exit={{ x: '-100%', transition: { duration: 0.3 } }}
    >
      <motion.ul
      className="bg-primary"
        exit={{ opacity: 0, transition: { duration: 0 } }}
      >
        {treeData.children.map((node, idx) => (
          <TreeMenuItem key={node.id} node={node} index={idx + 1} />
        ))}
      </motion.ul>
    </motion.div>
  )
}

export default NavMenu
