import React from 'react'

const Header = ({theme, title}) => (
  <div className='HeaderContainer'>
    <div className={'HeaderBG '+theme}>
      <div className={'HeaderTXT '+theme}>
        {title}
      </div>
    </div>
  </div>
)

export default Header