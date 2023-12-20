import React,{ useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './ChannelName.css'
import './DnD.css'

const ChannelName = (props) => {
  const [css, setCss] = useState('channelNameAnim')
   
  useEffect(() => {
    setCss('channelNameAnim '+props.theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channel,props.theme])

  return (
    <div className={'prevent-select '+css} onAnimationEnd={()=>setCss('channelName '+props.theme)}>{props.channel.name}</div>
  )
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel
  }
}
export default connect(mapStateToProps,null)(ChannelName)