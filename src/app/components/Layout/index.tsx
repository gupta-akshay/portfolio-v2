import { Fragment, ReactNode } from 'react';
import SiteNav from './SiteNav';
import BackBtn from '../BackBtn';

const Layout = ({
  children,
  isBlog = false,
}: {
  children: ReactNode;
  isBlog?: boolean;
}) => {
  return (
    <Fragment>
      <SiteNav />
      <main
        id='main-content'
        className='main-right pp-main-section'
        tabIndex={-1}
      >
        {children}
      </main>
      {isBlog && (
        <div className='fixed-controls' role='group' aria-label='Page controls'>
          <BackBtn />
        </div>
      )}
    </Fragment>
  );
};

export default Layout;
