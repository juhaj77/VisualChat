import React, { useEffect } from 'react'
//import React from 'react'
import FocusScrollable from './FocusScrollable'
import MessageForm from './MessageForm'
import { HoverButton } from './Login'
//import { useDrag, DndProvider, useDrop } from 'react-dnd'
//import HTML5Backend from 'react-dnd-html5-backend'
import DropDownContainer from './DropDownContainer'
import { connect } from 'react-redux'
import './Chat.css'
import './DnD.css'


const ChatWindow = (props) => {

const handle = () => {	
  props.setChat(false)
}

return (
  <div>
    <div className={'channelpanel '+props.theme}>
      <table style={{width:'100%', borderTop:'1px solid #443922'}}>
        <tbody>
           <tr>
             <td className='tdchannel'>
              <div className={'prevent-select channel '+props.theme}>
                CHANNEL 
              </div>
             </td>
             <td className='tdchannel2'>
              <div className={'prevent-select create '+props.theme}>
                create new channel
              </div>
              <div style={{marginLeft:'0.5em', display:'inline'}}>
                <button className={'prevent-select hoverbutton '+props.theme} style={{
                  fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif', 
                  fontWeight:'700'}}  onClick={handle}>create</button>
              </div>
             </td>
            </tr>
          </tbody>
        </table>
      </div>
      <DropDownContainer theme={props.theme} user={props.user} />
      <FocusScrollable theme={props.theme}/>
      <MessageForm theme={props.theme}/>
    </div>
)
}

const mapStateToProps = (state) => {
return {
  user: state.loggedUser
}
}
export default connect(mapStateToProps)(ChatWindow)
 
/*
const ChatWindow = (props) => {
  const [, drop] = useDrop({
    accept: ['cw'],
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset()
      const left = Math.round(item.left + delta.x)
      const top = Math.round(item.top + delta.y)
      if(item.type == 'cw') setPos({left, top})
      return undefined
    },
  })

  const [pos, setPos] = useState({left:'0px',top:'0px'})
  
  useEffect(() =>{
    console.log(document.getElementById('chat-window'))
    //setPos({left: document.getElementById('chat-window').style.left, top: document.getElementById('chat-window').style.top})
  },[])
  
  const [{ isDragging }, drag] = useDrag({
    item: { id:'chat-window', left: pos.left , top:pos.top, type: 'cw'},
    collect: monitor => {
      return {isDragging: monitor.isDragging()}
    },
  })

  const handle = () => {	
    props.setChat(false)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div ref={drop} style={{width:'100vw',height:'100vh'}}>
        <div ref={drag} id='chat-window' className='cw' style={{position:'absolute,top:pos.top,left:pos.left'}} >
          <div style={{backgroundColor: 'black',color:'white',borderBottom:'1px solid #443922', marginTop:'-0.2em'}}>
            <table style={{width:'100%', borderTop:'1px solid #443922'}}>
              <tbody>
                <tr>
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
      </div>
    </DndProvider>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.loggedUser
  }
}
export default connect(mapStateToProps)(ChatWindow)
*/
