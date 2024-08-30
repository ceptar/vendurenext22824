import * as React from "react";
import { useQuery } from '@components/utils/client'
import NavMenu from '@components/animated/navbar/NavMenu'
import { MenuToggle } from '@components/animated/navbar/Toggle'
import { motion, AnimatePresence, useCycle } from 'framer-motion'
import { arrayToTree } from '@components/utils/array-to-tree'


interface Collection {
  id: string
  slug: string
  name: string
  parentId: string | null
}

interface CollectionsData {
  collections: {
    items: Collection[]
  }
}

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
`

export default function MenuSidebarView() {
  const [isOpen, toggleOpen] = useCycle(false, true)

  const { data, loading, error } =
    useQuery<CollectionsData>(GET_ALL_COLLECTIONS)

  if (loading) return <p>Loading...</p>
  if (error) {
    console.error('GraphQL error:', error)
    return <p>Error: {error.message}</p>
  }

  const treeData = arrayToTree(data?.collections?.items || [])

  console.log('Tree Data:', treeData) // Logging the tree data

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom="100%"
    >
   <section className="flex flex-row-reverse">

            <AnimatePresence>
       {isOpen && <NavMenu treeData={treeData} />}
        <MenuToggle toggle={() => toggleOpen()} />


        </AnimatePresence> 
       </section>
    </motion.nav>

  )
}
