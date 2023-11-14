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
import Theme from './Theme'
import Clock from './Clock'
import { useTransition, animated } from 'react-spring'
import './Chat.css'
import './DnD.css'


const Chat = ({theme,setTheme, user, channel, connectedUsers, gapi, clearUser}) => {
  
  const [chat, setChat] = useState(true)
  const [index, setIndex] = useState(0)
  //const [theme, setTheme] = useState('dark')

  const elements = [
    {id: 0, content: <div></div>},
    {id: 1, content: <ChatWindow theme={theme} setTheme={setTheme} setChat={setChat}/>},
    {id: 2, content: <CreateChannelForm theme={theme} setChat={setChat}/>}
  ]
  useEffect(() => {
    if(theme === 'light'){
      document.getElementById('root').style.backgroundImage='url(/b2l.gif)'
      document.getElementById('bg').style.backgroundImage='url(/bl.gif)'
      document.body.style.backgroundColor='#ebf5fc'
    } else {
      document.getElementById('root').style.backgroundImage='url(/b2.gif)'
      document.getElementById('bg').style.backgroundImage='url(/b.gif)'
      document.body.style.backgroundColor='black'
    }
  },[theme])

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
      <DnDContainer theme={theme}/>
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
      <Segment  style={{margin:'0',padding:'0',border:'0px',backgroundColor:'transparent'}} placeholder >
        {channel && dnd()}
      </Segment>
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props,zIndex:'10',position:'absolute',top:'0em',left:'oem'}}>
          <div className={'panel '+theme}>
            <Theme setTheme={setTheme} theme={theme} />
          <div>	
          {channel && <ChannelName theme={theme}/>}
          </div>
          <div className={'clock '+theme} >
            <Clock/>
          </div>
          </div>
        </animated.div> )}
      {transitions2.map(({ item, props, key }) => (
        <animated.div
          key={key}
          style={{ ...props,zIndex:'10',position:'absolute',bottom:'0em',right:'0em',minWidth:'22rem', width:'21vw',paddingRight:'0'}}>
          {item.content}
        </animated.div>
      ))}
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props,zIndex:'10',position:'absolute',top:'0em',right:'0em'}}>
          <div className={'prevent-select loggedin '+theme}>{user && user.username} is logged in </div>
          <div style={{float:'left',display:'inline'}}>
            <button className={'prevent-select logoutbutton hoverbutton '+theme} onClick={handleLogout}>logout</button>
          </div>
        </animated.div>)}
      {transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={{...props}} className={'connected '+theme}>
          <span className={'prevent-select connectedusers '+theme}>connected users</span>
          <ul className='prevent-select' style={{
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
