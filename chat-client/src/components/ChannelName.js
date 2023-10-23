import React,{ useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './ChannelName.css'

const ChannelName = (props) => {
  const [css, setCss] = useState('channelNameAnim')
   
  useEffect(() => {
    setCss('channelNameAnim')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channel])

  return (
    <div className={css} onAnimationEnd={()=>setCss('channelName')}>{props.channel.name}</div>
  )
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel
  }
}
export default connect(mapStateToProps,null)(ChannelName)