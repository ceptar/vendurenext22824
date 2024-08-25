import { FC, useState, useEffect, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import throttle from 'lodash.throttle';
import cn from 'clsx';
import { motion } from 'framer-motion';
import s from './Navbar.module.css';

const NavbarRoot: FC<{ children?: ReactNode }> = ({ children }) => {
  const { theme } = useTheme(); // Use the hook to get the current theme
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
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

  // Determine the background color based on the theme
  const baseColor = theme === 'dark' ? '17, 17, 17' : '247, 247, 244'; // Dark or Light RGB

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