import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { addFile,callback } from '../reducers/fileReducer'
import { ToastContainer, toast } from 'react-toastify'
import styled from 'styled-components'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'reactstrap'
import { useDispatch } from 'react-redux'
//import { HoverButton } from './Login'
import './DnD.css'
import './Chat.css'

const options = {
    autoClose: false,
    position: toast.POSITION.BOTTOM_CENTER,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0.5,
  }

export const FlexItem = styled.div`
  text-align: center; 
  width: 100%; 
  align-self: strech;
`
const FormHeader = styled.span`
  text-align: center;
  font-size: 2em; 
  line-height: 1em; 
  font-weight: 800; 
  padding: 0; 
`
const LabelStyle = styled.p`
  line-height: 1em; 
  margin: 0.2em 0 0.3em 0; 
  font-size: 1.2em;
  font-weight:bold; 
`

const ShareFile = ({theme,setVisible,top,left,channelId,user,channel }) => {
  const [loaded, setLoaded] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const dispatch = useDispatch()
  const onChangeHandler = (event) => {
    const { files } = event.target
    if(files[0] && files[0].size < 6000000) {
      setLoaded(0)
      setSelectedFile(files[0])
    } else {
      toast.warn('File size is too big!', {
        position: toast.POSITION.BOTTOM_CENTER
    })
    }
  }
  const baseUrl = '/api/files'

  const upload = async (payload) => {
    toast.info('uploading...', options)
    await axios.post(`${baseUrl}/add/${channelId}`, 
          payload,  
          { headers: { Authorization: user.token } }, 
          {
            onUploadProgress: (ProgressEvent) => {
            // eslint-disable-next-line no-mixed-operators
            setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
          }, })
        .then(res => {
          dispatch(addFile(res.data,channel.id,user))
          dispatch(callback(channel.id,user))
        })
        .catch(e => {
          alert(e.message+', '+e.name+', '+e.code)
        })
  setVisible(false)
  }

  const onClickHandler = (id) => {
    const data = new FormData()
    if(!selectedFile){
      toast.error('select file', {
        position: toast.POSITION.BOTTOM_CENTER
      })
      return
    }
    data.append('uploaded_file', selectedFile)
    data.append('name', selectedFile.name)
    data.append('top', top)
    data.append('left', left)
    upload(data)
  }

  return (
    <div className={'Container2 '+theme} style={{display:'flex', flexDirection:'column',alignItems: 'center', justifyContent:'center',zIndex:'199',position:'absolute',top:top,left:left}}>
      <FormHeader className='prevent-select'>
        select file
      </FormHeader>
      <FlexItem>
        <LabelStyle className='prevent-select'>max size 6M</LabelStyle>
        <input
          style={{ paddingLeft:'0.5em', lineHeight: '1.5em', fontSize: '1em', margin: '0'}}
          type="file"
          name="upload_file"
          className={'form-control-file inputstyle '+theme}
          onChange={onChangeHandler}
        />
      </FlexItem>
      <FlexItem className='prevent-select'>
        <ToastContainer style={{ zIndex:'5000',fontSize: '1.4em' }} />
        <Progress className='prevent-select' max="100" color="success" value={loaded}>
          {Math.round(loaded, 2) }
          %
        </Progress>
        <button className={'hoverbutton '+theme} type="submit" onClick={onClickHandler}>submit</button>
        &ensp;&ensp;&ensp;&ensp;
        <button className={'hoverbutton '+theme} type="submit" onClick={()=>setVisible(false)}>cancel</button>
      </FlexItem>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
    user: state.loggedUser,
  }
}

export default connect(
  mapStateToProps,null)(ShareFile) 