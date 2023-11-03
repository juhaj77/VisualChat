import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import  { useField } from '../hooks/field'
import { initializeUsers } from '../reducers/usersReducer'
import { createChannel } from '../reducers/channelsReducer'
import { newFeed } from '../reducers/messageReducer'
import { initEmpty } from '../reducers/noteReducer'
import { initEmptyPictures } from '../reducers/pictureReducer'
import { initEmptyHtmls } from '../reducers/htmlReducer'
import { setError } from '../reducers/errorReducer'
import Info from './Info'
import { setChannel } from '../reducers/selectedChannelReducer'
import { Form, Dropdown } from 'semantic-ui-react'
import { HoverButton } from './Chat'
import styled from 'styled-components'

const CreateChannelForm = (props) => {

  const [selection, setSelection] = useState([])
  const name = useField('text')
  const [message,setMessage] = useState(null)
  const [channelsCount,setChannelsCount] = useState(props.channels.length)
	
  const resetWarnings = () => {
    setMessage(null)
    props.setError(null)
  }
  
  useEffect(() => {
    if(props.error) setMessage({content:props.error.message,color:'red'})
  },[props.error])

  useEffect(() => {
    if(props.user) props.initializeUsers(props.user)
    if(channelsCount < props.channels.length){
      setChannelsCount(props.channels.length)
      const setNewChannel = async () => {
        const chId = await props.channels.find(i => i.name === name.input.value.trim()).id
        await props.setChannel(chId, name.input.value.trim(), props.user)
        await props.newFeed()
        await props.initEmpty()
        await props.initEmptyPictures()
        await props.initEmptyHtmls()
        resetWarnings()	
      }
      setNewChannel()
      props.setChat(true)
    }
    return () => {
      resetWarnings()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channels])

  const handleChange = (e,data) => {
    e.preventDefault()
    setSelection(data.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const chName = name.input.value.trim()
    if(selection.length > 0 && chName !== '') {
      if(props.channels.find(c => c.name === chName)){
        setMessage({content:'dublicate channel name',color:'red'})
        return
      }
      await props.createChannel(chName, [...selection,props.user.userId], props.user)
    }
    else setMessage({content:'users or name missing', color:'red'})
  }
  const cancel = () => {
    props.setChat(true)
  }

  const Button = styled(HoverButton)`
    font-size:1.1em;
    font-weight:500; 
    padding:0.25em 0.4em 0.4em 0.4em;
    border-radius:2px;
    vertical-align:middle;
    margin-top:1.4em;
    display:inline;
  `

  if(props.users)
    return (
      <div style={{textAlign:'center'}}>
        <Form inverted>
          <Form.Input
            label='Name'
            placeholder='channel name'
            style={{width:'80%', margin:'auto'}}
            {...name.input}
          />
          <div style={{width:'80%', margin:'auto'}}>
            <div style={{color:'white',fontWeight:'bold', paddingBottom:'0.3em'}}>Users</div>
            <Dropdown label='Users' placeholder='users' fluid multiple search selection 
              options={props.users.filter(u => (u.id !== props.user.userId)).map(u => ({key:u.id, text:u.username,value:u.id}))}
              onChange={handleChange}
            />
          </div>
          <div style={{margin:'auto',textAlign:'center'}}>
            <Button type='button' onClick={handleSubmit}>create</Button>
            <Button type='button' style={{marginLeft:'1.4em'}} onClick={cancel}>cancel</Button>
          </div>
        </Form>
        <div style={{margin:'auto',width:'80%',marginTop:'2em'}}>
          <Info message={message} clear={resetWarnings} />
        </div>
      </div>
    )
  return <div></div>
}

const mapStateToProps = (state) => {
  return {
    user: state.loggedUser,
    users: state.users,
    channels: state.channels,
    error:state.error
  }
}

export default connect(mapStateToProps,{ initializeUsers,
  createChannel,
  setError,
  setChannel,
  newFeed,
  initEmpty,
  initEmptyPictures,
  initEmptyHtmls})(CreateChannelForm)