import { Fragment } from 'react';

const Header = () => {
  return (
    <Fragment>
      {/* Mobile Header */}
      <div className='mob-header'></div>
      {/* End Mobile Header */}
      <header className='header-left'>
        <div className='scroll-bar'>
          <div className='hl-top'>
            <div className='hl-logo'>
              <div className='img'>
                {/* <img src='static/img/about-me.jpg' title='' alt='' /> */}
              </div>
              <h5>Akshay Gupta</h5>
            </div>
          </div>
        </div>
        <div className='social-icons'>Social</div>
      </header>
    </Fragment>
  );
};

export default Header;
