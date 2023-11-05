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
import { HoverButton } from './Login'
import Clock from './Clock'
import { useTransition, animated } from 'react-spring'
import './Chat.css'

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
    if(gapi) gapi.auth2.getAuthInstance().signOut()
  }

  return (
    <div>
      <Segment  style={{margin:'0',padding:'0',backgroundColor:'transparent'}} placeholder >
        {channel && dnd()}
      </Segment>
      <div style={{position:'absolute',top:'2em',left:'40%'}}>	
        {channel && <ChannelName/>}
      </div>
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props,zIndex:'10',position:'absolute',top:'2em',left:'3em'}}>
          <div className='clock' ><Clock/></div>
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
          <div className='loggedin'>{user && user.username} is logged in </div>
          <div style={{float:'left',display:'inline'}}>
            <HoverButton className='logoutbutton' onClick={handleLogout}>logout</HoverButton>
          </div>
        </animated.div>)}
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props}} className='connected'>
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
