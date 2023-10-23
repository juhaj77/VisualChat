import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import ChatWindow from './ChatWindow'
import CreateChannelForm from './CreateChannelForm'
import DnDContainer from './DnDContainer'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { clearUser } from '../reducers/loggedUserReducer'
import ChannelName from './ChannelName'
import { Segment } from 'semantic-ui-react'
import Clock from './Clock'
import styled from 'styled-components'
import { useTransition, animated } from 'react-spring'
import './Chat.css'

export const HoverButton = styled.button`
border: 1px solid #665533;
cursor:pointer;
color:#b29966;
background-color:black;
transition: background-color 250ms ease-in, border-color 250ms ease-in, color 250ms ease-in;
&:hover{
  background-color:rgba(53, 46, 17, 0.6);
  border-color: #b29966;
  color: #d4c6aa;
}
`
const Chat = ({user, channel, connectedUsers, gapi, clearUser}) => {
  
  const [chat, setChat] = useState(true)
  const [index, setIndex] = useState(0)

  const elements = [
    {id: 0, content: <div></div>},
    {id: 1, content: <ChatWindow setChat={setChat}/>},
    {id: 2, content: <CreateChannelForm setChat={setChat}/>}
  ]
  
  useEffect(() => {
    if(!user) setIndex(0)
    else if(user && chat) setIndex(1)
    else setIndex(2)
  },[user,chat])
	
  const transitions = useTransition(user, null, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: {  opacity: 1, transform: 'scale(1)' },
    leave: {  opacity: 0, transform: 'scale(0)' },
    config: { mass: 1, tension: 300, friction: 12 }
  })

  const transitions2 = useTransition(elements[index], item => item.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 250 }
  })

  const dnd = () => (
    <DndProvider backend={HTML5Backend}>
      <DnDContainer/>
    </DndProvider>
  )

  const handleLogout = (event) => {
    event.preventDefault()
    document.getElementById('root').style.backgroundPositionX = '0px'
    document.getElementById('root').style.backgroundPositionY = '0px'
    document.getElementById('bg').style.backgroundPositionX = '0px'
    document.getElementById('bg').style.backgroundPositionY = '0px'
    clearUser(user)
    setChat(true)
    if(gapi) gapi.auth2.getAuthInstance().signOut().then(() => console.log('Oauth2 Signout'))
  }

  return (
    <div>
      <Segment  style={{margin:'0',padding:'0',backgroundColor:'transparent'}} placeholder >
        {channel && dnd()}
      </Segment>
      <div style={{position:'absolute',top:'2em',left:'40%'}}>	
        {channel && <span style={{width:'100%',fontWeight:'700', color:'#d4c6aa'}}>
          <ChannelName/>
        </span>}
      </div>
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props,zIndex:'10',position:'absolute',top:'2em',left:'3em'}}>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '1.4em', 
            fontWeight:'700',
            textAlign:'left',
            color:'#b29966',
            textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black'
          }} ><Clock/></div>
        </animated.div> )}
      {transitions2.map(({ item, props, key }) => (
        <animated.div
          key={key}
          style={{ ...props,zIndex:'10',position:'absolute',top:'2em',right:'2em',minWidth:'22rem', width:'25vw',paddingRight:'0'}}>
          {item.content}
        </animated.div>
      ))}
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props,zIndex:'10',position:'absolute',bottom:'2em',left:'2em'}}>
          <div style={{
            borderRadius:'2px 0px 0px 2px', 
            fontSize:'1.2em',
            float:'left',
            display:'inline',
            fontWeight:'500', 
            color:'#e5ddcc',
            whiteSpace: 'nowrap',
            backgroundColor:'rgba(0,0,0,0.7)',
            marginTop:'1px',
            padding:'0.15em 0.5em 0.2em 0.35em',
            textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
          }}>{user && user.username} is logged in </div>
          <div style={{float:'left',display:'inline'}}>
            <HoverButton style={{
              cursor: 'pointer',
              fontSize:'1.1em',
              marginLeft:'0em',
              borderRadius:'2px',
              fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif',
              fontWeight:'700',
              padding:'0.25em 0.4em 0.25em 0.4em',
              textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black'
            }} onClick={handleLogout}>logout</HoverButton>
          </div>
        </animated.div>)}
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props,
          lineHeight:'1.1em',
          fontSize:'1.1em',
          textAlign:'center', 
          position:'absolute',
          zIndex:'10',
          bottom:'2em',
          right:'2em',
          padding:'0.3em 0.6em 0.3em 0.6em',
          fontWeight:'500',
          border:'solid 1px #665533', 
          color:'#b29966',
          whiteSpace: 'nowrap',
          backgroundColor:'rgba(0,0,0,0.7)',
          textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
        }}>
          <span style={{
            fontWeight:'400',
            color:'#e5ddcc',
            textAlign:'center', 
            borderBottom:'1px solid #b29966'
          }}>connected users</span>
          <ul style={{fontWeight:'400',
            listStyleType:'none',
            marginTop:'0',
            marginBottom:'0',
            padding:'0.2em 0 0 0'
          }}>
            {connectedUsers && connectedUsers.map((e,i) => <li style={{flex:'right'}} key={i}>{e}</li>)}
          </ul>
        </animated.div>)}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.loggedUser,
    channel: state.channel,
    connectedUsers: state.connectedUsers,
    gapi: state.gapi
  }
}
export default connect(mapStateToProps,{ clearUser })(Chat)
