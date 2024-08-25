import { FC, useState, useEffect, ReactNode } from 'react'
import throttle from 'lodash.throttle'
import cn from 'clsx'
import { motion, useAnimation } from 'framer-motion'
import s from './Navbar.module.css'

const NavbarRoot: FC<{ children?: ReactNode }> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = throttle(() => {
      const { scrollTop } = document.documentElement
      setScrollY(scrollTop)
    }, 200)

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Animate background opacity based on scroll position
    const bgOpacity = scrollY < 48 ? scrollY / 48 : 1
    controls.start({ '--bg-opacity': bgOpacity }) // Adjust the opacity variable based on scroll position
  }, [scrollY, controls])

  return (
    <motion.div
      className={cn(s.root)}
      style={{ '--bg-opacity': 0 }} // Start with transparent background
      animate={controls}
      initial={{ '--bg-opacity': 0 }}
      transition={{ duration: 0.2 }} // Smooth transition
    >
      {children}
    </motion.div>
  )
}

export default NavbarRoot