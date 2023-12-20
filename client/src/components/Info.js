import React, { useState, useEffect, useRef } from 'react'
import { useTransition, animated } from 'react-spring'

const Info = ({message,clear}) => {

  const [text, setText] = useState(message)
  const [show, setShow] = useState(false)
  const id1 = useRef(-1)
  const id2 = useRef(-1)
   
  useEffect(() => {
    if(message) {setShow(true)
      setText(message)
      id1.current = setTimeout(() => {
        setShow(false)
        id2.current = setTimeout(() => {
          clear()
        },800)
      },5000)
    } else setShow(false)
    return () => {
      clearTimeout(id1.current)
    }
  }, [message, clear])
 
  const transitions = useTransition(show, null, {
    from: { opacity: 0} ,
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {duration:250}
  })

  return transitions.map(({ item, key, props }) => (
    item && <animated.div key={key} style={{
      color:text.color,
      backgroundColor:'black',
      border:`1px solid ${text.color}`,
      borderRadius:'6px', 
      padding:'1em',
      fontSize:'1.2em',
      margin:'0em',
      ...props}}>
      {text.content}
    </animated.div>
  ))
}

export default Info