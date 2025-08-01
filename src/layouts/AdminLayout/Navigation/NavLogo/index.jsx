import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/images/logo.png';

import { ConfigContext } from '../../../../contexts/ConfigContext';

const NavLogo = () => {
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;

  let toggleClass = ['mobile-menu'];
  if (collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  return (
    <React.Fragment>
      <div className="navbar-brand header-logo">
        <Link to="#" className="b-brand">
          <img src={Logo} style={{ width: '40px', borderRadius: '4px', rotate: '-10deg' }} />
          <span className="b-title text">Joke App</span>
        </Link>
        {/* <Link to="#" className={toggleClass.join(' ')} id="mobile-collapse" onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}>
          <span />
        </Link> */}
      </div>
    </React.Fragment>
  );
};

export default NavLogo;
