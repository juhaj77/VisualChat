import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { addPicture,callback } from '../reducers/pictureReducer'
import { ToastContainer, toast } from 'react-toastify'
import styled from 'styled-components'
import 'react-toastify/dist/ReactToastify.css'
import { Progress } from 'reactstrap'
import { useField } from '../hooks/field'
import { useDispatch } from 'react-redux'
import { HoverButton } from './Login'

const options = {
    autoClose: false,
    position: toast.POSITION.BOTTOM_CENTER,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0.5,
  }

const FlexItem = styled.div`
  text-align: center; 
  width: 100%; 
  align-self: strech;
`
const Container2 = styled.div`
  overflow:visible; 
  color: #665533; 
  background: black;
  border:solid 1px #665533;
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin:1.666em 0 0 0;
  align-content: space-between; 
  padding: .5em; 
  white-space: nowrap;
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
const TextInput = styled.input`
  line-height: 1em;
  height: 2.6em;  
  font-size: 1em; 
  width:97%;
  margin: 0; 
  padding: 0;
`

const UploadForm = ({setVisible,top,left,channelId,user,channel }) => {
  const [loaded, setLoaded] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const itemName = useField('text', '')
  const dispatch = useDispatch()
  console.log('\nUploadForm data:',left,top)
  const onChangeHandler = (event) => {
    const { files } = event.target
    if(files[0] && files[0].size < 1000000 && files[0].name.match(/\.(png)$/)) {
      setLoaded(0)
      setSelectedFile(files[0])
    } else {
      toast.warn('File type is wrong or file size too big!', {
        position: toast.POSITION.BOTTOM_CENTER
    })
    }
  }
  const baseUrl = '/api/pictures'

  const upload = async (payload) => {
    toast.info('uploading...', options)
    await axios.post(`${baseUrl}/add/${channelId}`, payload, {
        onUploadProgress: (ProgressEvent) => {
        // eslint-disable-next-line no-mixed-operators
          setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
        }, })
        .then(res => {
          dispatch(addPicture(res,channel.id,user))
          dispatch(callback(channel.id,user))
        })
        .catch(e => {
          console.log(e)
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
    if(itemName.input.value == ''){
      toast.error('name is required', {
        position: toast.POSITION.BOTTOM_CENTER
      })
      return
    }
    data.append('name', itemName.input.value)
    data.append('top', top)
    data.append('left', left)
    upload(data)
  }

  return (
    <Container2 style={{display:'flex', flexDirection:'column',alignItems: 'center', justifyContent:'center',zIndex:'199',position:'absolute',top:top,left:left}}>
      <FormHeader>
        select picture
      </FormHeader>
      <FlexItem>
        <LabelStyle>small png. max 1M </LabelStyle>
        <input
          style={{ paddingLeft:'0.5em', lineHeight: '1.5em', fontSize: '1em', margin: '0', background:'black',color:'#665533'}}
          type="file"
          name="upload_file"
          className="form-control-file"
          onChange={onChangeHandler}
        />
      </FlexItem>
      <FlexItem>
        <LabelStyle>name: </LabelStyle>
        <TextInput placeholder="required" {...itemName.input} className="form-control" required />
      </FlexItem>
      <FlexItem>
        <ToastContainer style={{ zIndex:'5000',fontSize: '1.4em' }} />
        <Progress max="100" color="success" value={loaded}>
          {Math.round(loaded, 2) }
          %
        </Progress>
        <HoverButton type="submit" onClick={onClickHandler}>submit</HoverButton>
        &ensp;&ensp;&ensp;&ensp;
        <HoverButton type="submit" onClick={()=>setVisible(false)}>cancel</HoverButton>
      </FlexItem>
    </Container2>
  )
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
    user: state.loggedUser,
  }
}

export default connect(
  mapStateToProps,null)(UploadForm) 

 //export default UploadForm