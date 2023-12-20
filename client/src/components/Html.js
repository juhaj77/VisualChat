import React, { useState, useEffect } from 'react'
import { useTransition, animated } from 'react-spring'
import { connect } from 'react-redux'

const Html = (props) => {

  const [pr, set] = useState(props)
  const [show, setShow] = useState(true)

  useEffect(() => {
    document.getElementById(props.id).innerHTML=props.content 
  }, [])

  useEffect(() => {
    return () => {setShow(false)}
  }, [props.channel])

  const transitions = useTransition(show, null, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' },
    
  })

  return transitions.map(({ item, key, props }) => 
    <animated.div key={key}  style={{position:'absolute',left:pr.left,top:pr.top,...props}}  >
        <div id={pr.id}></div>
    </animated.div>)
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
  }
}

export default connect(mapStateToProps,null)(Html)