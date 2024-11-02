import { Fragment, ReactNode } from 'react';
import Header from './Header';
import DayNightToggle from '../DayNightToggle';
import BackBtn from '../BackBtn';

const Layout = ({
  children,
  isBlog = false,
}: {
  children: ReactNode,
  isBlog?: boolean,
}) => {
  return (
    <Fragment>
      <a href='#main-content' className='skip-link'>
        Skip to main content
      </a>
      <Header />
      <main
        id='main-content'
        className='main-right pp-main-section'
        tabIndex={-1}
      >
        {children}
      </main>
      <div className='fixed-controls' role='group' aria-label='Page controls'>
        <DayNightToggle />
        {isBlog && <BackBtn />}
      </div>
    </Fragment>
  );
};

export default Layout;
