import React from 'react'
import styled from 'styled-components'
import ScrollableFeed from 'react-scrollable-feed'
import Message from './Message'
import { connect } from 'react-redux'
import './Chat.css'

const FocusScrollable = (props) => {

  if(props.user)
    return (
      <div className={'scrollable '+props.theme}>
        <ScrollableFeed forceScroll='true'>
          {props.messages.map((m,i) => <Message theme={props.theme} index={props.messages.length - i} key={i} message={m} user={props.user.username} />)}
        </ScrollableFeed>
      </div>
    ) 
  return <div></div>
} 
//
const mapStateToProps = (state) => {
  return { user: state.loggedUser,
    messages: state.messages } }
export default connect(mapStateToProps, null)(FocusScrollable) 