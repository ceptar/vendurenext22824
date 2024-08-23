export type HasParent = { id: string; parentId: string | null }
// Adjusted types
export type TreeNode<T extends HasParent> = T & {
  children: Array<TreeNode<T>>
  isParent: boolean // Make these properties required
  isChild: boolean
}

export type RootNode<T extends HasParent> = {
  id?: string
  children: Array<TreeNode<T>>
}

export function arrayToTree<T extends HasParent>(nodes: T[]): RootNode<T> {
  const topLevelNodes: Array<TreeNode<T>> = []
  const mappedArr: { [id: string]: TreeNode<T> } = {}

  // Map nodes to a hash table
  for (const node of nodes) {
    mappedArr[node.id] = {
      ...(node as any),
      children: [],
      isParent: false, // Initialize as false
      isChild: false, // Initialize as false
    }
  }

  for (const node of nodes) {
    const mappedElem = mappedArr[node.id]
    const parentId = mappedElem.parentId

    if (parentId) {
      const parent = mappedArr[parentId]
      if (parent) {
        // If the parent exists, push this node as a child of the parent
        parent.children.push(mappedElem)
        parent.isParent = true // Mark parent as a parent since it has children
        mappedElem.isChild = true // Mark this node as a child since it has a parent
      } else {
        // Parent doesn't exist in the data, consider this a top-level node
        topLevelNodes.push(mappedElem)
        mappedElem.isParent = true // Mark this node as a parent (root)
      }
    } else {
      // No parentId, this is a top-level node (root)
      topLevelNodes.push(mappedElem)
      mappedElem.isParent = true // Mark this node as a parent (root)
    }
  }

  // Return the constructed tree
  return { id: undefined, children: topLevelNodes }
}
