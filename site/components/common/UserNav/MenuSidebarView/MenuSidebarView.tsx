import { useQuery } from '@components/utils/client'; // GraphQL query
import NavMenu from "@components/animated/navbar/NavMenu";
import Navbar from "@components/animated/navbar/Navbar";
import { AnimatePresence } from "framer-motion";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_ALL_COLLECTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Transform flat collection data into a tree structure
  const treeData = arrayToTree(data.collections.items);

  return (
    <section className="relative flex flex-row-reverse">
      <AnimatePresence>
        {menuOpen && <NavMenu treeData={treeData} />}
      </AnimatePresence>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </section>
  );
}