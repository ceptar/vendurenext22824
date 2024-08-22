import { FC } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import DiscoLogo from '@components/icons/DiscoLogo'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import { MenuSidebarView } from '../UserNav'
// import { Searchbar, UserNav } from '@components/common'

interface Link {
  href: string
  label: string
}

interface NavbarProps {
  links?: Link[]
}

const Navbar: FC<NavbarProps> = ({ links }) => (
  <NavbarRoot>
    <Container clean className="mx-auto max-w-8xl">
      <div className={s.nav}>
        <div className="flex items-center flex-1">
          {/* <Link href="/" className={s.logo} aria-label="Logo"> */}
          < UserNav />
          {/* </Link> */}
          {/* <nav className={s.navMenu}>
            <Link href="/search" className={s.link}>
              All
            </Link>
            {links?.map((l) => (
              <Link href={l.href} key={l.href} className={s.link}>
                {l.label}
              </Link>
            ))}
          </nav> */}
        </div>
        <div className="flex items-center flex-1 justify-center">
        <Link href="/"  aria-label="Logo">
        <DiscoLogo className="max-h-12 w-auto" />
        </Link>
        </div>
        {/* {process.env.COMMERCE_SEARCH_ENABLED && (
          <div className="justify-center flex-1 hidden lg:flex">
            <Searchbar />
          </div>
        )} */}
        <div className="flex items-center justify-end flex-1">

          <MenuSidebarView />
          {/* <UserNav /> */}
        </div>
      </div>
      {/* {process.env.COMMERCE_SEARCH_ENABLED && (
        <div className="flex pb-4 lg:px-6 lg:hidden">
          <Searchbar id="mobile-search" />
        </div>
      )} */}
    </Container>
  </NavbarRoot>
)

export default Navbar
