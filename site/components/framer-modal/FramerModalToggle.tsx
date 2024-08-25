import React, { useEffect } from 'react'
import { useAnimation, motion } from 'framer-motion'
interface FramerModalToggleProps {
  menuOpen: boolean
  setMenuOpen: (_: boolean) => void
}

const FramerModalToggle: React.FC<FramerModalToggleProps> = ({
  menuOpen,
  setMenuOpen,
}) => {
  const path1Controls = useAnimation()
  const path2Controls = useAnimation()

  const path1Variants = {
    open: {
      d: 'M 90.66,13.025 H 9.3398 c -0.6328,0 -1.207,0.363 -1.4805,0.934 -0.2695,0.574 -0.1835,1.25 0.2188,1.738 L 39,48.525 v 29.852 l 19.488,23.153 c 0.429,0.44 1.097,0.57 1.66,0.32 0.566,-0.26 0.906,-0.85 0.852,-1.47 V 48.526 L 91.922,15.698 c 0.402,-0.489 0.488,-1.165 0.218,-1.739 -0.273,-0.57 -0.847,-0.933 -1.48,-0.933 z m -9.559,7.5 -18,20.18 c -0.309,0.301 -0.797,0.313 -1.121,0.02 -0.32,-0.286 -0.363,-0.774 -0.102,-1.114 l 18,-20.09 c 0.285,-0.328 0.778,-0.375 1.121,-0.109 0.325,0.285 0.368,0.773 0.102,1.109 z',
    },
    closed: {
      d: 'M 90.66,13.025 H 9.3398 c -0.6328,0 -1.207,0.363 -1.4805,0.934 -0.2695,0.574 -0.1835,1.25 0.2188,1.738 L 39,48.525 v 29.852 l 19.488,23.153 c 0.429,0.44 1.097,0.57 1.66,0.32 0.566,-0.26 0.906,-0.85 0.852,-1.47 V 48.526 L 91.922,15.698 c 0.402,-0.489 0.488,-1.165 0.218,-1.739 -0.273,-0.57 -0.847,-0.933 -1.48,-0.933 z m -9.559,7.5 -18,20.18 c -0.309,0.301 -0.797,0.313 -1.121,0.02 -0.32,-0.286 -0.363,-0.774 -0.102,-1.114 l 18,-20.09 c 0.285,-0.328 0.778,-0.375 1.121,-0.109 0.325,0.285 0.368,0.773 0.102,1.109 z',
    },
  }

  const path2Variants = {
    open: {
      d: 'M 90.66,13.025 H 9.3398 c -0.6328,0 -1.207,0.363 -1.4805,0.934 -0.2695,0.574 -0.1835,1.25 0.2188,1.738 L 39,48.525 v 29.852 l 19.488,23.153 c 0.429,0.44 1.097,0.57 1.66,0.32 0.566,-0.26 0.906,-0.85 0.852,-1.47 V 48.526 L 91.922,15.698 c 0.402,-0.489 0.488,-1.165 0.218,-1.739 -0.273,-0.57 -0.847,-0.933 -1.48,-0.933 z m -9.559,7.5 -18,20.18 c -0.309,0.301 -0.797,0.313 -1.121,0.02 -0.32,-0.286 -0.363,-0.774 -0.102,-1.114 l 18,-20.09 c 0.285,-0.328 0.778,-0.375 1.121,-0.109 0.325,0.285 0.368,0.773 0.102,1.109 z',
    },
    closed: {
      d: 'M 90.66,13.025 H 9.3398 c -0.6328,0 -1.207,0.363 -1.4805,0.934 -0.2695,0.574 -0.1835,1.25 0.2188,1.738 L 39,48.525 v 29.852 l 19.488,23.153 c 0.429,0.44 1.097,0.57 1.66,0.32 0.566,-0.26 0.906,-0.85 0.852,-1.47 V 48.526 L 91.922,15.698 c 0.402,-0.489 0.488,-1.165 0.218,-1.739 -0.273,-0.57 -0.847,-0.933 -1.48,-0.933 z m -9.559,7.5 -18,20.18 c -0.309,0.301 -0.797,0.313 -1.121,0.02 -0.32,-0.286 -0.363,-0.774 -0.102,-1.114 l 18,-20.09 c 0.285,-0.328 0.778,-0.375 1.121,-0.109 0.325,0.285 0.368,0.773 0.102,1.109 z',
    },
  }

  useEffect(() => {
    if (menuOpen) {
      path1Controls.start(path1Variants.open)
      path2Controls.start(path2Variants.open)
    } else {
      path1Controls.start(path1Variants.closed)
      path2Controls.start(path2Variants.closed)
    }
  }, [menuOpen])

  return (
    <div
      className="p-1 bg-white bg-opacity-80 shadow-md rounded-full my-auto justify-self-center items-center border-discogray flex flex-col gap-2 cursor-pointer stroke-black stroke-2 transition-all duration-300 ease-out hover:opacity-70"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <svg width="36" height="36" viewBox="-5.0 -10.0 110.0 135.0">
        <motion.path
          {...path1Variants.closed}
          animate={path1Controls}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          {...path2Variants.closed}
          animate={path2Controls}
          transition={{ duration: 0.2 }}
        />
      </svg>
    </div>
  )
}

export default FramerModalToggle
