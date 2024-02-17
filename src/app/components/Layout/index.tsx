import { Fragment, ReactNode } from 'react';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      <main className='main-right pp-main-section'>{children}</main>
    </Fragment>
  );
};

export default Layout;
