import { FC, useState, useEffect, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import throttle from 'lodash.throttle';
import cn from 'clsx';
import { motion } from 'framer-motion';
import s from './Navbar.module.css';

const NavbarRoot: FC<{ children?: ReactNode }> = ({ children }) => {
  const { theme, resolvedTheme } = useTheme(); // Use resolvedTheme to get the correct theme value
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false); // State to check if component has mounted

  useEffect(() => {
    setMounted(true); // Set the component as mounted when it's loaded

    const handleScroll = throttle(() => {
      const { scrollTop } = document.documentElement;
      setScrollY(scrollTop);
    }, 200);

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const bgOpacity = scrollY < 48 ? scrollY / 48 : 1;

  // Determine the background color based on the resolved theme
  const baseColor = resolvedTheme === 'dark' ? '17, 17, 17' : '255, 255, 255'; // Dark or Light RGB

  // Only render once the theme is mounted to avoid mismatch
  if (!mounted) return null;

  return (
    <motion.div
      className={cn(s.root)}
      style={{
        backgroundColor: `rgba(${baseColor}, ${bgOpacity})`,
        transition: 'background-color 0.3s',
      }}
    >
      {children}
    </motion.div>
  );
};

export default NavbarRoot;