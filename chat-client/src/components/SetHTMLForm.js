import React from 'react'
import { Container2, FlexItem } from './UploadForm'
import styled from 'styled-components'
import { useField } from '../hooks/field'
import { HoverButton } from './Login'
import './DnD.css'

const TextInput = styled.input`
  line-height: 1em;
  height: 2em;  
  font-size: 1em; 
  width:97%;
  margin: 0 0 0.5em 0; 
  padding: 0;
`

const SetHTMLForm = (props) => {
  const html = useField('text', '')
 
  const onClickHandler = (id) => {
    props.addHtml({left:props.left+55,top:props.top+75,content:html.input.value},props.channel.id, props.user)
    html.reset()
    props.setVisible(false)
  }

  return (
    <Container2 style={{display:'flex', flexDirection:'column',alignItems: 'center', justifyContent:'center',zIndex:'199',position:'absolute',top:props.top,left:props.left}}>
      <div id='testhtml'></div>
      <FlexItem>
        <TextInput placeholder="html" {...html.input} className="form-control" required />
      </FlexItem>
      <FlexItem className='prevent-select'>
        <HoverButton type="submit" onClick={onClickHandler}>submit</HoverButton>
        &ensp;&ensp;&ensp;&ensp;
        <HoverButton type="submit" onClick={()=>props.setVisible(false)}>cancel</HoverButton>
      </FlexItem>
    </Container2>
  )
}

export default SetHTMLForm
