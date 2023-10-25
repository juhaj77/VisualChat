/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react'
import Header from './Header'
import { useTransition, animated } from 'react-spring'
//import { useDrag } from 'react-dnd'

import { connect } from 'react-redux'

const MyImage = (props) => {

  const [loaded, setLoaded] = useState(false) 
  
  const transitions = useTransition(loaded, null, {
    from: { opacity: 0 },
    enter: { opacity: 1},
    leave: { opacity: 0},
  })
  const top = Number(props.top)+60
  const left = Number(props.left)+60
  const name = props.name

  useEffect(() => {
    return () => {setLoaded(false)}
  }, [props.channel])
  /*
  const [{ isDragging }, drag] = useDrag({
    item: { id:props.id, left:props.left, top:props.top, type: 'image' },
    collect: monitor => {
      return {isDragging: monitor.isDragging()}
    },
  })
  if (isDragging) {
    return <div ref={drag} />
  }*/

  const arrayBufferToBase64 = (buffer) => {
    let binary = ''
    const bytes = [].slice.call(new Uint8Array(buffer))
    // eslint-disable-next-line no-return-assign
    bytes.forEach((b) => binary += String.fromCharCode(b))
    return window.btoa(binary)
  }

  const pic = new Image()
  pic.src = `data:${props.picture.contentType};`
        + `base64,${arrayBufferToBase64(props.picture.data.data)}`
  pic.onload = () => setLoaded(true)

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
      height: 'calc(100vh/2 - 1em/3)',
      margin: '0 1em 0 0',
    }}
    >
      <Header title={name} />
      <img src={pic.src} alt={name}/>
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
