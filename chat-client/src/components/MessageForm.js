import React, { useState, useEffect } from 'react'
import  { useField } from '../hooks/field'
import { addMsg, removeAnimation } from '../reducers/messageReducer'
import Info from './Info'
import { connect } from 'react-redux'
import { HoverButton } from './Chat'
/*eslint-disable eqeqeq*/
const MessageForm = (props) => {

  const [warning, setWarning] = useState(null)
  const msg = useField('text')

  useEffect(() => {
    setWarning(null)
  }, [props.channel])

  useEffect(() => {
    return () => setWarning(null)
  }, [])

  const sendMsg = async () => {
    const txt = msg.input.value
    if(props.channel != ''){
      setWarning(null)
      await props.removeAnimation()
      await props.addMsg(txt,props.user, props.channel.id)
    } else {
      setWarning({content:'select channel first',color:'red'})
    }
    msg.reset()
  }
  
  const keyPressed = event => { if(event.key === 'Enter') sendMsg() }

  if(props.user)
    return (
      <div style={{background:'black',border:'none'}}>
        <input placeholder='write your msg here' style={{
          padding:'0.1em 0 0.1em 0',
          fontWeight:'500',
          fontSize:'1.2em',
          paddingLeft:'0.4em',
          lineHeight:'1.2em',
          backgroundColor:'black',
          borderTop: 'none',
          borderBottom: '1px solid #443922',
          borderLeft:'none',
          borderRight:'none',
          color:'#b29966',
          width:'80%'}} 
        onKeyPress={keyPressed} {...msg.input} />
        <HoverButton style={{
          padding:'0.2em 0 0.15em 0',
          marginTop:'0px',
          fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif', 
          fontWeight:'700',
          width:'20%'}} 
        onClick={sendMsg}>send</HoverButton>
        <Info message={warning} clear={() => setWarning(null)} />
      </div>
    )
  return <div></div>
}

const mapStateToProps = (state) => {
  return {
    user: state.loggedUser,
    channel: state.channel
  }
}
export default connect(mapStateToProps, { addMsg,removeAnimation })(MessageForm)
