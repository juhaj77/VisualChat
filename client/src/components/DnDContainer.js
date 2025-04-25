import React, { useState, useEffect, useRef } from 'react'
import { useDrop } from 'react-dnd'
import Note from './Note'
import MyImage from './Image'
import Html from './Html'
import File from './File'
import StyledSpinner from './StyledSpinner'
import {addNote, setNote, deleteNote} from '../reducers/noteReducer'
import { setHtml, addHtml } from '../reducers/htmlReducer'
import { connect } from 'react-redux'
import UploadForm from './UploadForm'
import SetHTMLForm from './SetHTMLForm'
import ShareFile from './ShareFile'
import mapD from './noteColorsDark'
import mapL from './noteColorsLight'
import { CSSTransition } from 'react-transition-group';
import './DnD.css'


const DnDContainer = (props) => {
        
  const [menu, setMenu] = useState(false) 
  const [menuStyle, setMenuStyle] = useState({zIndex:1000,position: 'absolute', left:0, top:0})
  const [menu2, setMenu2] = useState(false)
  const [menu2Props, setMenu2Props] = useState(false)
  const [uploadForm, setUploadForm] = useState(false)
  const [htmlForm, setHtmlForm] = useState(false)
  const [shareFile, setShareFile] = useState(false)
  const [formStyle, setFormStyle] = useState({zIndex:1000,position: 'absolute', left: 0, top:0})
  const [pos, setPos] = useState({left:'0px',top:'0px'})
  const [map, setMap] = useState(mapD)
  const menuRef = useRef(null)
  const menu2Ref = useRef(null)
  const uploadFormRef = useRef(null)
  const shareFileRef = useRef(null)
  const htmlFormRef = useRef(null)
  const [zIndex, setZIndex] = useState('5')

  useEffect(() => {
    if(props.theme === 'light') {
      setMap(mapL)
    } else {
      setMap(mapD)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.theme])


  const moveNote = (id, left, top) => {
    const note= props.notes.find(n => n.id === id)
    props.setNote({...note, top: top, left:left}, props.channel.id, props.user)
  }

  const [, drop] = useDrop({
    accept: 'note',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      const left = Math.round(item.left + delta.x)
      const top = Math.round(item.top + delta.y)
      moveNote(item.id, left, top)
      return undefined
    },
  })
  
  const handleContextMenu = (event) => {
    event.preventDefault()

    const top = event.nativeEvent.offsetY - document.getElementById('wa').offsetHeight
    const left = event.nativeEvent.offsetX

    if(menu.visible || menu2.visible){
      hideMenus()
      return
    }
    if( event.target.id === 'dnd' ){
      setMenuStyle({zIndex:1000,position: 'absolute', left, top})
      setMenu(true)
      setMenu2(false)
    } else if(event.nativeEvent.target.className === 'noteHeader' || 
              event.nativeEvent.target.className === 'txt-place') {
      handleContextMenu2(event)
    }
  }
  const handleContextMenu2 = (event) => {
    const left = Number(event.target.offsetParent.style.left.replace('px','')) + Number(event.nativeEvent.offsetX)
    const top = Number(event.target.offsetParent.style.top.replace('px','')) + Number(event.nativeEvent.offsetY)
 
    setMenu2Props({id: event.nativeEvent.target.offsetParent.id,
                    style:{
                      position: 'absolute',
                      left:left,
                      top:top,
                      zIndex:1000}
                    })
    setMenu2(true)
    setMenu(false)
  }
  const handleAddNote = (e) => {
    e.preventDefault()
    const date = new Date()
    let top = menuStyle.top + document.getElementById('wa').offsetHeight
    props.addNote({left: menuStyle.left,
                  top, backgroundColor:'#ffffcc',
                  date: new Date(date.getTime()-date.getTimezoneOffset()*60*1000),
                  author: props.user.username},
                  props.channel.id, props.user)
    setMenu(false)
  }

  const handleUploadPicture = (event) => {
    event.preventDefault()
    setUploadForm(true)
    setFormStyle({zIndex:1000,position: 'absolute', left: menuStyle.left, top: menuStyle.top})
    hideMenus()
  }
  const handleShareFile = (event) => {
    event.preventDefault()
    setShareFile(true)
    setFormStyle({zIndex:1000,position: 'absolute', left: menuStyle.left, top: menuStyle.top})
    hideMenus()
  }
  const handleAddHTML = async (event) => {
    event.preventDefault()
    setHtmlForm(true)
    setFormStyle({zIndex:1000,position: 'absolute', left: menuStyle.left, top: menuStyle.top})
    hideMenus()
  }
  const handleDelete = (e) => {
    e.preventDefault()
    props.deleteNote(menu2Props.id, props.channel.id, props.user)
  }

  const setColor = (e) => {
    e.preventDefault()
    const note= props.notes.find(n => n.id === menu2Props.id)
    props.setNote({...note, backgroundColor: e.nativeEvent.target.id}, props.channel.id, props.user)
    hideMenus()
  }
  const html = (props) => <div>
                              <CSSTransition
                                  in={htmlForm}
                                  nodeRef={htmlFormRef}
                                  timeout={500}
                                  classNames="contextmenu"
                                  unmountOnExit
                                > 
                                  <div ref={htmlFormRef} >
                                    <SetHTMLForm setVisible={setHtmlForm}
                                      {...props}
                                      top={formStyle.top} 
                                      left={formStyle.left} 
                                      channelId={props.channel.id} 
                                      />
                                  </div>
                                </CSSTransition>
                              </div>

  const upload = (props) => <div>
                              <CSSTransition
                                  in={uploadForm}
                                  nodeRef={uploadFormRef}
                                  timeout={500}
                                  classNames="contextmenu"
                                  unmountOnExit
                                > 
                                  <div ref={uploadFormRef} >
                                    <UploadForm setVisible={setUploadForm} 
                                      top={formStyle.top} 
                                      left={formStyle.left} 
                                      channelId={props.channel.id} 
                                      theme={props.theme}/>
                                  </div>
                                </CSSTransition>
                              </div>

  const share = (props) => <div>
                            <CSSTransition
                                in={shareFile}
                                nodeRef={shareFileRef}
                                timeout={500}
                                classNames="contextmenu"
                                unmountOnExit
                              > 
                                <div ref={shareFileRef} >
                                  <ShareFile setVisible={setShareFile} 
                                    top={formStyle.top} 
                                    left={formStyle.left} 
                                    channelId={props.channel.id} 
                                    theme={props.theme}/>
                                </div>
                              </CSSTransition>
                            </div>

  const contextMenu2 = () => <div>
                              <CSSTransition
                                  in={menu2}
                                  nodeRef={menu2Ref}
                                  timeout={500}
                                  classNames="contextmenu"
                                  unmountOnExit
                                >
                                <div className={'menu '+props.theme} ref={menu2Ref} style={{...menu2Props.style, width:'9rem'}}>
                                    <ul className="menu-options">
                                      <li className={'prevent-select menu-option '+props.theme} onClick={handleDelete}>
                                        delete note
                                      </li>
                                      <li className={'prevent-select menu-option '+props.theme} >
                                        <div className='dropdown prevent-select' >
                                          set color
                                          <div className="dropdown-content">
                                            <table className={'dropdown-content-style '+props.theme}>
                                              <tbody>
                                                <tr>
                                                  <td><button className='button' id='#ffffcc' onClick={setColor} style={{background:map.get('#ffffcc').background}}></button></td>
                                                  <td><button className='button' id='#ffcccc' onClick={setColor} style={{background:map.get('#ffcccc').background}}></button></td>
                                                  <td><button className='button' id='#ccffff' onClick={setColor} style={{background:map.get('#ccffff').background}}></button></td>
                                                </tr>
                                                <tr>
                                                  <td><button className='button' id='#99ffcc' onClick={setColor} style={{background:map.get('#99ffcc').background}}></button></td>
                                                  <td><button className='button' id='#ffccff' onClick={setColor} style={{background:map.get('#ffccff').background}}></button></td>
                                                  <td><button className='button' id='#80ffff' onClick={setColor} style={{background:map.get('#80ffff').background}}></button></td>
                                                </tr>
                                                <tr>
                                                  <td><button className='button' id='#ff99c2' onClick={setColor} style={{background:map.get('#ff99c2').background}}></button></td>
                                                  <td><button className='button' id='#99ff99' onClick={setColor} style={{background:map.get('#99ff99').background}}></button></td>
                                                  <td><button className='button' id='#ff99ff' onClick={setColor} style={{background:map.get('#ff99ff').background}}></button></td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>  
                                  </CSSTransition>
                              </div>

  const contextMenu = () => <div>
                              <CSSTransition
                                  in={menu}
                                  nodeRef={menuRef}
                                  timeout={500}
                                  classNames="contextmenu"
                                  unmountOnExit
                                >
                                <div className={'menu '+props.theme} ref={menuRef} style={{...menuStyle, width:'9rem'}}>
                                  <ul className="menu-options">
                                    <li className={'prevent-select menu-option '+props.theme} onClick={handleAddNote}>
                                      add note
                                    </li>
                                    <li className={'prevent-select menu-option '+props.theme} onClick={handleUploadPicture}>
                                      upload picture
                                    </li>
                                    <li className={'prevent-select menu-option '+props.theme} onClick={handleShareFile}>
                                      share file
                                    </li>
                                    <li className={'prevent-select menu-option '+props.theme} onClick={handleAddHTML}>
                                      add HTML
                                    </li>
                                  </ul>
                                </div>
                              </CSSTransition>
                            </div>
  
  const hideMenus = () => {
    setMenu(false)
    setMenu2(false) 
  }

  let offsetX, offsetY
  let moveContent = false
	
  const move = e => {
    if(moveContent && e.target.className !== 'note') {
      document.getElementById('dndWrapper').style.left = `${e.pageX-offsetX}px`
      document.getElementById('dndWrapper').style.top = `${e.pageY-offsetY}px`
      document.getElementById('bg').style.backgroundPositionX = `${e.pageX-offsetX}px`
      document.getElementById('bg').style.backgroundPositionY = `${e.pageY-offsetY}px`
    }
  }

  const start = e => {
    setZIndex('2')
    if(e.target.className === 'dndC'){
      moveContent = true
      offsetX = e.clientX - Number(pos.left.replace('px',''))
      offsetY = e.clientY - Number(pos.top.replace('px',''))
    }
  }
  
  const stop = e => {
    moveContent = false
    if(e.target.className === 'dndC'){
      setPos({
        left : document.getElementById('dndWrapper').style.left ,
        top :  document.getElementById('dndWrapper').style.top
      })
      setZIndex('5')
    }
  }

  const onpointerdown = e => {
    if(e.target.id === 'dnd') setZIndex('2')
  }

  if(props.notes)
    return (
      <div className={'prevent-select dndWrapper '+props.theme} id='dndWrapper' onContextMenu={handleContextMenu}
        onPointerOver={onpointerover}
        onPointerDown={onpointerdown}
        onClick={hideMenus} 
        onMouseMove={move}
        onMouseDown={start}
        onMouseUp={stop}
        onMouseOut={stop}
        style={{...pos}}>
        <div className={'hoverthing '+props.theme}>
            <div ref={drop} id='dnd' className='dndC'
              style={{zIndex:zIndex}}
            >
              <div className='prevent-select' id='wa'>&nbsp;draggable working area</div>
              {props.htmls.map(h => <Html key={h.id} {...h}/>)}
              {props.notes.map(b => <Note theme={props.theme} key={b.id} {...b}/> )}
              {props.files.map((i) => <File theme={props.theme} key={i.id} {...i}/>)}
              {share(props)}
              {contextMenu()}
              {contextMenu2()}
              {upload(props)}
              {html(props)}
            </div>
          {props.pictures.map((i) => <MyImage theme={props.theme} key={i.id} {...i}/>)}

        </div>
      </div>
    )
  return <StyledSpinner/>
}
const mapStateToProps = (state) => {
  return {
    user: state.loggedUser,
    channel: state.channel,
    notes: state.notes,
    pictures: state.pictures,
    htmls: state.htmls,
    files: state.files
  }
}
export default connect(mapStateToProps,{
  addHtml, 
  setHtml, 
  addNote, 
  setNote, 
  deleteNote})(DnDContainer)