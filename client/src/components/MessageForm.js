import React, { useState, useEffect } from 'react'
import  { useField } from '../hooks/field'
import { addMsg, removeAnimation } from '../reducers/messageReducer'
import Info from './Info'
import { connect } from 'react-redux'
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
    if(props.channel !== ''){
      setWarning(null)
      await props.removeAnimation()
      await props.addMsg(txt,props.user, props.channel.id)
    } else {
      setWarning({content:'select channel first',color:'red'})
    }
    msg.reset()
  }
  
  const keyPressed = event => { if(event.key === 'Enter') sendMsg() }

    return <div style={{background:'black',border:'none'}}>
        <input placeholder='write your msg here' className={'msginput '+props.theme} 
        onKeyPress={keyPressed} title={msg.input.value} {...msg.input} />
        <button className={'prevent-select hoverbutton '+props.theme} style={{
          padding:'0.2em 0 0.15em 0',
          marginTop:'0px',
          fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif', 
          fontWeight:'700',
          width:'20%'}} 
        onClick={sendMsg}>send</button>
        <Info message={warning} clear={() => setWarning(null)} />
      </div>
}

const mapStateToProps = (state) => {
  return {
    user: state.loggedUser,
    channel: state.channel
  }
}
export default connect(mapStateToProps, { addMsg,removeAnimation })(MessageForm)
