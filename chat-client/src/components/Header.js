import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  position: relative;
  top: 1.5em;
  height: fit-content;
  lineHeight: 1.5em;
`
const HeaderBG = styled.div`
  display: inline-block;
  float: left;
  text-align: left;
  line-height: 1.5em;
  border-bottom: .1em solid black;
  border-radius: 0 0 .333em 0;
  background-color: black;
`
const HeaderTXT = styled.div`
  font-size: 1.5em;
  padding: 0 .2em 0 0em;
  font-family: Russo One; sans-serif;
  color: #a9bfd6;
`
const Header = ({ title }) => (
  <HeaderContainer>
    <HeaderBG>
      <HeaderTXT>
        {title}
      </HeaderTXT>
    </HeaderBG>
  </HeaderContainer>
)

export default Header