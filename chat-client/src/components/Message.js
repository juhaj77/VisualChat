import React from 'react'
import { connect } from 'react-redux'
import { removeAnimation } from '../reducers/messageReducer'
import './Message.css'

const Message = (props) => {

  /*eslint-disable eqeqeq*/

  let name = props.message.split(':',1)
  let msg = props.message.replace(name + ':', '')
  let uus = false

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

  if(name == 'UUSIVIESTI'){
    name = msg.split(':',1)
    msg = msg.replace(name + ':', '')
    uus=true
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
    if(uus) return (
      <div className='mymessage' onAnimationEnd={props.removeAnimation}>
        {msg}
      </div>
    )
    return (
      <div style={{color:'#e9d396',padding:'8px 12px 8px 12px',borderRadius:'9px',backgroundColor:'rgba(5, 5, 5,0.5)'}}>
        {msg}
      </div>
    )
  }

  let style = {
    color:'#e5ddcc',
    marginRight:'0.7rem',
    marginLeft:'0.3rem',
    marginBottom:'0.5rem',
    backgroundColor:'transparent', 
    display:'inline-block', 
    float:'left'}

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
        <span style={{color:'white',marginBottom:'0px'}}>
          {name}
        </span>
        <span style={{color: '#d4c6aa',fontSize:'10px',marginBottom:'0px'}}>
          &nbsp;&nbsp;{date}
        </span><br/>
      </>)
    return (<><span style={{color:'white',fontWeight:'500',marginBottom:'0px'}}>{name}</span><br/></>)
  }

  return (
    <div style={{marginBottom:'0px'}}>
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
