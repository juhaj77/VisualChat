/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react'
import Header from './Header'
import { useTransition, animated } from 'react-spring'
import { connect } from 'react-redux'

const MyImage = (props) => {

  const [loaded, setLoaded] = useState(false) 
  const [picSrc, setPicSrc] = useState(null)
  
  const transitions = useTransition(loaded, null, {
    from: { opacity: 0 },
    enter: { opacity: 1},
    leave: { opacity: 0},
  })

  const top = Number(props.top) + document.getElementById('dnd').offsetTop
  const left = Number(props.left) + document.getElementById('dnd').offsetLeft
  const name = props.name
  const theme = props.theme

  // for fade out:
  useEffect(() => {
    return () => {
      setLoaded(false)
    }
  }, [props.channel])

  const arrayBufferToBase64 = (buffer) => {
    let binary = ''
    const bytes = [].slice.call(new Uint8Array(buffer))
    // eslint-disable-next-line no-return-assign
    bytes.forEach((b) => binary += String.fromCharCode(b))
    return window.btoa(binary)
  }

  useEffect(() => {
    const pic = new Image()
    pic.src = `data:${props.file.contentType};`
          + `base64,${arrayBufferToBase64(props.file.data.data)}`
    pic.onload = () => setLoaded(true)
    setPicSrc(pic)
  }, [props.file])

  return transitions.map(({ item, key, props }) =>
  item && <animated.div key={key} style={{
    ...props, 
    position:'absolute',
    top:top,
    left:left}} >
    <div className='image' style={{
      width: 'fit-content',
      zIndex:'0',
      textAlign: 'center',
      margin: '0',
    }}
    >
      <Header theme={theme} title={name} />
      <img src={picSrc.src} alt={name}/>
    </div> 
    </animated.div>)
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
  }
}

export default connect(
  mapStateToProps,null)(MyImage)
