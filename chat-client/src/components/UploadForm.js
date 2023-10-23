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
  text-align: left; 
  width: 100%; 
  align-self: strech;
`
const Container2 = styled.div`
  overflow:visible; 
  color: white; 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin:1.666em 0 0 0;
  background-color: brown;
  align-content: space-between; 
  padding: .5em; 
  white-space: nowrap;
`
const FormHeader = styled.span`
  font-size: 2em; 
  line-height: 1em; 
  font-weight: 800; 
  padding: 0; 
  color: white;
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

  const onChangeHandler = (event) => {
    const { files } = event.target
    console.log('\nfiles:'.files)
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
    let res = null
    try {
      toast.info('uploading...', options)
       res = await axios.post(`${baseUrl}/add/${channelId}`, payload, {
        onUploadProgress: (ProgressEvent) => {
        // eslint-disable-next-line no-mixed-operators
          setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
        },
      })
      //const item = await axios.get(`${urlPrefix}/api/get/${res.data}`)
      toast.dismiss({
        position: toast.POSITION.BOTTOM_CENTER
    })
      toast.success('upload success', {
        position: toast.POSITION.BOTTOM_CENTER
    })
    setVisible({visible:false})
   if(res) {
    dispatch(addPicture(res,channel.id,user))
    dispatch(callback(channel.id,user))
   }
      //addItem(item.data)
    } catch (e) {
      toast.dismiss({
        position: toast.POSITION.BOTTOM_CENTER
      })
      toast.error('upload fail', {
        position: toast.POSITION.BOTTOM_CENTER
      })
      setVisible({visible:false})
      }
    }

  const onClickHandler = (id) => {
    const data = new FormData()
    data.append('uploaded_file', selectedFile)
    data.append('name', itemName.input.value)
    data.append('top', top)
    data.append('left', left)
    upload(data).then(() => {
      setLoaded(0)
      setSelectedFile(undefined)
      itemName.reset()
    }).catch((e) => {
      toast.dismiss({
        position: toast.POSITION.BOTTOM_CENTER
    })
      toast.error(e, {
        position: toast.POSITION.BOTTOM_CENTER
    })
    })
  }

  return (
    <Container2 style={{position:'absolute',top:top,left:left}}>
      <FormHeader>
        Select a picture...
      </FormHeader>
      <FlexItem>
        <LabelStyle>Small png. Max 1M </LabelStyle>
        <input
          style={{ lineHeight: '1.5em', fontSize: '1em', margin: '0' }}
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
        <button
          style={{
            fontSize: '1.2em', fontWeight: 'bold', verticalAlign: 'middle', display: 'inline-block',
          }}
          type="submit"
          className="btn btn-success btn-block"
          onClick={onClickHandler}
        >
          submit
        </button>
        &ensp;&ensp;&ensp;&ensp;
        <button
          style={{
            fontSize: '1.2em', fontWeight: 'bold', verticalAlign: 'middle', display: 'inline-block',
          }}
          type="submit"
          className="btn btn-success btn-block"
          onClick={()=>setVisible(false)}
        >cancel</button>
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