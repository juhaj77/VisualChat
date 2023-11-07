import React from 'react'
import { FlexItem } from './UploadForm'
import styled from 'styled-components'
import { useField } from '../hooks/field'
import './DnD.css'
import './Chat.css'

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
    <div className={'Container2 '+props.theme} style={{display:'flex', flexDirection:'column',alignItems: 'center', justifyContent:'center',zIndex:'199',position:'absolute',top:props.top,left:props.left}}>
      <div id='testhtml'></div>
      <FlexItem>
        <TextInput placeholder="html" {...html.input} className="form-control" required />
      </FlexItem>
      <FlexItem className='prevent-select'>
      <button className={'hoverbutton '+props.theme} type="submit" onClick={onClickHandler}>submit</button>
        &ensp;&ensp;&ensp;&ensp;
        <button className={'hoverbutton '+props.theme} type="submit" onClick={()=>props.setVisible(false)}>cancel</button>
      </FlexItem>
    </div>
  )
}

export default SetHTMLForm
