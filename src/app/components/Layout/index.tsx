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
      <Header />
      <main className='main-right pp-main-section'>{children}</main>
      <DayNightToggle />
      {isBlog ? <BackBtn /> : null}
    </Fragment>
  );
};

export default Layout;
