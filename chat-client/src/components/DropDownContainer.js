import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeChannels } from '../reducers/channelsReducer'
import { initializeNotes } from '../reducers/noteReducer'
import { initializePictures } from '../reducers/pictureReducer'
import { setChannel } from '../reducers/selectedChannelReducer'
import { initializeMessages } from '../reducers/messageReducer'
import { initializeHtmls } from '../reducers/htmlReducer'
import './Chat.css'
import './DnD.css'
/*eslint-disable eqeqeq*/
const DropDownContainer = (props) => {

  useEffect(() => {
    props.initializeChannels(props.user)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange =  async e => {
    e.preventDefault()
    
    const index = e.target.selectedIndex
    const name = e.target.childNodes[index].value
    if(index !== 0 && name !== props.channel.name){
      const chId = props.channels.find(i => i.name == name).id
      await props.setChannel(chId, name, props.user)
      await props.initializeMessages(chId, props.user)
      await props.initializeNotes(chId, props.user)
      await props.initializePictures(chId, props.user)
      await props.initializeHtmls(chId, props.user)
    }
  }
	
  return (
    <div>
      <select onChange={handleChange} className={'prevent-select dropdown2 '+props.theme}>
        {[<option key='-1' 
          disabled 
          selected 
          hidden>select channel...</option>,
          ...props.channels.map((channel,i) => 
          (<option value={channel.name} key={i}>{channel.name}</option>))]}
      </select>
    </div>
  )    
}

const mapStateToProps = (state) => {
  return {
    channels: state.channels,
    channel: state.channel,
    user: state.loggedUser,
  }
}

export default connect(
  mapStateToProps,
  { initializeChannels, 
    setChannel, 
    initializeMessages,
    initializePictures,
    initializeNotes,
    initializeHtmls,
    })(DropDownContainer)