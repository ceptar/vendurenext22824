import React, { useEffect } from 'react'
import DiscoFilterToggle from '@components/icons/DiscoFilterToggle'

interface FramerModalToggleProps {
  menuOpen: boolean
  setMenuOpen: (_: boolean) => void
}

const FramerModalToggle: React.FC<FramerModalToggleProps> = ({
  menuOpen,
  setMenuOpen,
}) => {

  return (
    <div
      className="h-12 w-12 p-2 bg-primary rounded-full my-auto justify-self-center items-center flex flex-col cursor-pointer transition-all duration-300 ease-out hover:opacity-70"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <DiscoFilterToggle />
    </div>
  )
}

export default FramerModalToggle
