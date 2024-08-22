import { useQuery } from '@components/utils/client'; // GraphQL query
import NavMenu from "@components/animated/navbar/NavMenu";
import { MenuToggle } from "@components/animated/navbar/Toggle";
import { motion, AnimatePresence, useCycle } from "framer-motion";
import { arrayToTree } from '@components/utils/array-to-tree'; // Tree structure utility
import React, { useState } from "react";

// Your GraphQL query
const GET_ALL_COLLECTIONS = /* GraphQL */ `
  query GetAllCollections {
    collections {
      items {
        id
        slug
        name
        parentId
      }
    }
  }
`;

export default function MenuSidebarView() {
  const [ isOpen, toggleOpen ] = useCycle(true,false);
  const { data, loading, error } = useQuery(GET_ALL_COLLECTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Transform flat collection data into a tree structure
  const treeData = arrayToTree(data.collections.items);

  return (
    <motion.nav
    initial={false}
    animate={isOpen ? "open" : "closed"}
    custom="100%"
  >
    <section className="relative flex flex-row-reverse">


      <AnimatePresence>
        {isOpen && <NavMenu treeData={treeData} />}
      </AnimatePresence>
      <MenuToggle toggle={() => toggleOpen()} />
      </section>
      </motion.nav>

  );
}