import { Fragment, ReactNode } from 'react';
import Header from './Header';
import DayNightToggle from '../DayNightToggle';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      <main className='main-right pp-main-section'>{children}</main>
      <DayNightToggle />
    </Fragment>
  );
};

export default Layout;
