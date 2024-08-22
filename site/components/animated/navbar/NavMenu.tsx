import { motion } from "framer-motion";
import React from "react";

import { easings } from "@components/utils/animations";
import NavMenuItem from "./NavMenuItem";

import { arrayToTree, HasParent, TreeNode } from '@components/utils/array-to-tree'
import s from './animated-navbar.module.css'
import { useQuery } from '@components/utils/client'
import clickOutside from "@lib/click-outside";

const GET_ALL_COLLECTIONS = /*GraphQL*/ `
  query GetAllCollections {
    collections {
      items {
        id
        slug
        name
        parentId
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`
export default function NavMenu() {
  const { data, loading, error } = useQuery(GET_ALL_COLLECTIONS, {}, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Convert the flat collection list into a tree structure
  const treeData = arrayToTree(data.collections.items)
  return <CollectionList collection={treeData} />
}
function CollectionList(props: { collection: TreeNode<any> }) {
  return (
  <motion.nav
      className="absolute h-[calc(screen-80px)] top-[52px] w-screen bg-primary opacity-90 backdrop-blur-md flex flex-col justify-end pl-6 pr-2 py-6 pb-8 z-50"
      initial={{ x: "-100%" }}
      animate={{
        x: 0,
        transition: { duration: 1, ease: easings.easeOutQuart },
      }}
      exit={{ x: "-100%", transition: { duration: 0.3 } }}
    >
      <motion.ul exit={{ opacity: 0, transition: { duration: 0 } }}>
      {props.collection.children.map((child, idx) => {
                const className = child.isParent ? s.parent : s.child
                return (
                  <li className={`${className}`} key={child.id}>

            <NavMenuItem key={idx} index={idx + 1} title={child}  /> 
          {child.children.length > 0 && <CollectionList collection={child} />}
                    </li>

                )})}
      </motion.ul>
      </motion.nav>
  )
}

