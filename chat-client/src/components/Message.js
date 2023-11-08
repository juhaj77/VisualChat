import React from 'react'
import { connect } from 'react-redux'
import { removeAnimation } from '../reducers/messageReducer'
import './Message.css'
import './DnD.css'

const Message = (props) => {

  /*eslint-disable eqeqeq*/

  let name = props.message.split(':',1)
  let msg = props.message.replace(name + ':', '')
  let newmsg = false

  let color
  if(props.theme ==='dark'){
    color='#e9d396'
  } else {
    color='#96bae9'
  }

  const stringToDate = (s) => {
    try {
      var year = s.slice(0,4)
      var month = s.slice(5,7)
      var day = s.slice(8,10)
      var hour = s.slice(11,13)
      var min = s.slice(14,16)
      var sec =s.slice(17,19)
      return new Date(year,month,day,hour,min,sec,0)
    } catch(e) {
      return undefined
    }
  }

  if(name == 'NEW_MESSAGE'){
    name = msg.split(':',1)
    msg = msg.replace(name + ':', '')
    newmsg=true
  }

  const tempString = msg.split(';',1)
  const setDate = (date2) => {
    return date2.slice(8,10)+'.'+date2.slice(5,7)+'. '+date2.slice(11,16)
  }
  let date = undefined
  if(stringToDate(tempString[0]) != 'Invalid Date') {
    date = setDate(tempString[0])
    msg = msg.replace(tempString[0] + ';', '')
  }

  const setMessage = () => {
    if(newmsg) return (
      <div className='mymessage' onAnimationEnd={props.removeAnimation}>
        {msg}
      </div>
    )
    return (
      <div style={{color,padding:'8px 12px 8px 12px',borderRadius:'9px',backgroundColor:'rgba(5, 5, 5,0.5)'}}>
        {msg}
      </div>
    )
  }

  let style = {
    marginRight:'0.7rem',
    marginLeft:'0.3rem',
    marginBottom:'0.5rem',
    backgroundColor:'transparent', 
    display:'inline-block', 
    float:'left'}

    let dcolor
    if(props.theme ==='dark'){
      dcolor='#e5ddcc'
      style.color='#e5ddcc'
    } else {
      dcolor='#ccd4e5'
      style.color='#ccd4e5'
    }
  let headerStyle = {marginRight:'0.7rem',marginLeft:'0.3rem',float:'left', lineHeight:'1em'}

  if(props.user == name){
    style.textAlign = 'right'
    style.float = 'right'
    headerStyle.textAlign = 'right'
    headerStyle.float = 'right'
  }

  const setHeader = () => {
    if(date) return (
      <>
        <span className='prevent-select' style={{color:'white',marginBottom:'0px'}}>
          {name}
        </span>
        <span className='prevent-select' style={{color: dcolor,fontSize:'10px',marginBottom:'0px'}}>
          &nbsp;&nbsp;{date}
        </span><br/>
      </>)
    return (<><span style={{color:'white',fontWeight:'500',marginBottom:'0px'}}>{name}</span><br/></>)
  }

  return (
    <div key={props.key} style={{marginBottom:'0'}}>
      <div style={{clear:'left'}}></div>
      <div style={headerStyle}>
        {setHeader()}
      </div>
      <div style={{clear:'right'}}></div>
      <div style={{clear:'left'}}></div>
      <div style={style}>
        {setMessage()}
      </div>
      <div style={{clear:'right'}}></div>
    </div>
  )
}
export default connect(null,{ removeAnimation })(Message)
