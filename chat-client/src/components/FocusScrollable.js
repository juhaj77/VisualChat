import React from 'react'
import styled from 'styled-components'
import ScrollableFeed from 'react-scrollable-feed'
import Message from './Message'
import { connect } from 'react-redux'

const FocusScrollable = (props) => {

  const Div = styled.div`
      padding: 0.1em 0.3em;
      height: 33em;
      background-image:linear-gradient(rgba(85, 71, 43,0.7),rgba(22,12,12,0.7));
      color:#d9d9d9;
  `

  if(props.user)
    return (
      <Div>
        <ScrollableFeed>
          {props.messages.map((m,i) => <Message index={props.messages.length - i} key={i} message={m} user={props.user.username} />)}
        </ScrollableFeed>
      </Div>
    ) 
  return <div></div>
} 

const mapStateToProps = (state) => {
  return { user: state.loggedUser,
    messages: state.messages } }
export default connect(mapStateToProps, null)(FocusScrollable) 