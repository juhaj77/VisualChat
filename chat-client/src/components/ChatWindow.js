//import React, { useEffect, useState } from 'react'
import React from 'react'
import FocusScrollable from './FocusScrollable'
import MessageForm from './MessageForm'
import { HoverButton } from './Login'
//import { useDrag } from 'react-dnd'
import DropDownContainer from './DropDownContainer'
import { connect } from 'react-redux'
import './Chat.css'

const ChatWindow = (props) => {
/*
  const [pos, setPos] = useState({left:'0px',top:'0px'})

  let isDragging = false
  let drag = null
  useEffect(() =>{
    console.log(document.getElementById('chat-window'))
    setPos({left: document.getElementById('chat-window').style.left, top: document.getElementById('chat-window').style.top})
  },[])
  
  [{ isDragging }, drag] = useDrag({
    item: { id:'chat-window', left: pos.left , top:pos.top, type: 'cw'},
    collect: monitor => {
      return {isDragging: monitor.isDragging()}
    },
  })
  if (isDragging) {
    return <div ref={drag} />
  }
*/
  const handle = () => {	
    props.setChat(false)
  }

  return (
    <div>
      <div style={{backgroundColor: 'black',color:'white',borderBottom:'1px solid #443922', marginTop:'-0.2em'}}>
        <table style={{width:'100%', borderTop:'1px solid #443922'}}>
          <tbody>
            <tr >
              <td className='tdchannel'>
                <div className='channel'>
									CHANNEL 
                </div>
              </td>
              <td className='tdchannel2'>
                <div className='create'>
                  create new channel
                </div>
                <div style={{marginLeft:'0.5em', display:'inline'}}>
                  <HoverButton style={{
                    fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif', 
                    fontWeight:'700'}}  onClick={handle}>create</HoverButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <DropDownContainer user={props.user} />
      <FocusScrollable/>
      <MessageForm />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.loggedUser
  }
}
export default connect(mapStateToProps)(ChatWindow)