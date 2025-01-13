import Footer01 from '@/components/PIXELUP/Footer/Footer01/Footer01';
import Footer02 from '@/components/PIXELUP/Footer/Footer02/Footer02';
import Footer03 from '@/components/PIXELUP/Footer/Footer03/Footer03';
import Navbar02 from '@/components/PIXELUP/Navbar/Navbar02/Navbar02';

type FooterType = 'Footer01' | 'Footer02' | 'Footer03' ;
type NavbarType =  'Navbar02' ;

const footerComponents = {
  Footer01,
  Footer02,
  Footer03,
} as const;

const navbarComponents = {
  Navbar02,
} as const;

interface GlobalConfig {
  activeFooter: FooterType;
  activeNavbar: NavbarType;
}

export const globalConfig: GlobalConfig = {
  activeFooter: 'Footer02',
  activeNavbar: 'Navbar02',
};

export const getActiveFooter = () => {
  const FooterComponent = footerComponents[globalConfig.activeFooter];
  return FooterComponent;
};

export const getActiveNavbar = () => {
  const NavbarComponent = navbarComponents[globalConfig.activeNavbar];
  return NavbarComponent;
};