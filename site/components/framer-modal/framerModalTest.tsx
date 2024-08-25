import { useState } from 'react'
import FramerModal from '~/components/framer-modal/FramerModal'

export default function XYZ() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <FramerModal menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  )
}
