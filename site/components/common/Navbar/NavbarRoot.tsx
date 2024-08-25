import { FC, useState, useEffect, ReactNode } from 'react'
import throttle from 'lodash.throttle'
import cn from 'clsx'
import { motion } from 'framer-motion'
import s from './Navbar.module.css'

const NavbarRoot: FC<{ children?: ReactNode }> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0)
  const [bgOpacity, setBgOpacity] = useState(0) // State for background opacity

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
    // Calculate and set background opacity based on scroll position
    const opacity = scrollY < 48 ? scrollY / 48 : 1
    setBgOpacity(opacity)
  }, [scrollY])

  return (
    <motion.div
      className={cn(s.root)}
      style={{ '--bg-opacity': bgOpacity } as React.CSSProperties} // Set the custom CSS variable
      initial={{ backgroundColor: 'rgba(var(--primary-nav), 0)' }} // Initial style
      transition={{ duration: 0.2 }} // Smooth transition
    >
      {children}
    </motion.div>
  )
}

export default NavbarRoot