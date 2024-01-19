import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useTransition, animated } from 'react-spring'
import { connect } from 'react-redux'
import { deleteFile } from '../reducers/fileReducer'
import { useDispatch } from 'react-redux'

const File = (props) => {


  const [show, setShow] = useState(props.show)
  const dispatch = useDispatch()
  
  const transitions = useTransition(show, null, {
    from: { opacity: 0 },
    enter: { opacity: 1},
    leave: { opacity: 0},
  })

  const top = Number(props.top) + document.getElementById('wa').offsetHeight
  const left = Number(props.left)
  const name = props.name
  const theme = props.theme
  const id = props.id

  const arrayBufferToBase64 = (buffer) => {
    let binary = ''
    const bytes = [].slice.call(new Uint8Array(buffer))
    // eslint-disable-next-line no-return-assign
    bytes.forEach((b) => binary += String.fromCharCode(b))
    return btoa(binary)
  }

  useEffect(() => {
    return () => {setShow(false)}
  }, [props.channel,props.show])


  const baseUrl = '/api/files'
  const handleDownload = async () => {
    const link = document.getElementById(id)
    try {
      const res = await axios.get(`${baseUrl}/get/${id}`,{ headers: {Authorization: props.user.token}})
      link.href = `data:${res.data.file.contentType};`
        + `base64,${arrayBufferToBase64(res.data.file.data.data)}`
    } catch (e) {
      console.log(e)
    }
    link.download = props.name
    link.click()
  }

  const handleDelete = async () => {
    try{
      await axios.delete(`${baseUrl}/delete/${id}`, { headers: {Authorization: props.user.token}})
     // dispatch(callback(props.channel.id,props.user))
      dispatch(deleteFile(id,props.channel.id, props.user))
    } catch (e) {
      console.log(e)
    }
  }

  
  return transitions.map(({ item, key, props }) =>
  item && <animated.div key={key} style={{
    ...props, 
    position:'absolute',
    top:top,
    left:left,
    zIndex:'5'
    }} >
    <a id={id}/>
    <div className={'File '+theme}> 
      {name} <br/>
    <button className={'hoverbutton '+theme} style={{fontSize:'1em',lineHeight:'1em'}} type="submit" onClick={handleDownload}>download</button>
    <button className={'hoverbutton '+theme} style={{fontSize:'1em',lineHeight:'1em',marginLeft:'.2em'}} type="submit" onClick={handleDelete}>delete</button>
    </div>
    </animated.div>)
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
    user: state.loggedUser,
  }
}
export default connect(
    mapStateToProps,null)(File)