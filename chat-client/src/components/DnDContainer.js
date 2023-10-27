import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDrop } from 'react-dnd'
import Note from './Note'
import MyImage from './Image'
import {addNote, setNote, deleteNote} from '../reducers/noteReducer'
import { connect } from 'react-redux'
import UploadForm from './UploadForm'
import map from './noteColors'
import { CSSTransition } from 'react-transition-group';
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import './DnD.css'


const DnDContainer = (props) => {
        
  const [menu, setMenu] = useState(false) 
  const [menuStyle, setMenuStyle] = useState({zIndex:1000,position: 'absolute', left:0, top:0})
  const [menu2, setMenu2] = useState(false)
  const [menu2Props, setMenu2Props] = useState(false)
  const [uploadForm, setUploadForm] = useState(false)
  const [uploadFormStyle, setUploadFormStyle] = useState({zIndex:1000,position: 'absolute', left: 0, top:0})
  const [pos, setPos] = useState({left:'0px',top:'0px'})
  const [open, setOpen] = useState(undefined)
  const seen = useRef(false)
  const menuRef = useRef(null)
  const menu2Ref = useRef(null)
  const uploadFormRef = useRef(null)
  const [zIndex, setZIndex] = useState('5')

  const [, drop] = useDrop({
    accept: ['note'],
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset()
      const left = Math.round(item.left + delta.x)
      const top = Math.round(item.top + delta.y)
      if(item.type == 'note') moveNote(item.id, left, top)
      return undefined
    },
  })

  const moveNote = (id, left, top) => {
    const note= props.notes.find(n => n.id === id)
    props.setNote({...note, top: top, left:left}, props.channel.id, props.user)
		
  }
  const handleContextMenu = (event) => {
    event.preventDefault()

    const top = event.nativeEvent.offsetY - document.getElementById('wa').offsetHeight
    const left = event.nativeEvent.offsetX
    
    console.log('ONCONTEXTMENU\nevent.nativeEvent.offset X Y',left,top,
    '\noffsetParent',event.target.offsetParent.style.left,event.target.offsetParent.style.top,
    '\nevent.nativeEvent.target.id:',event.nativeEvent.target.id,
    '\nevent.nativeEvent.target.className:',event.nativeEvent.target.className)

    if(menu.visible || menu2.visible){
      setMenu2(false)
      setMenu(false)
      return
    }
    if( event.target.id === 'dnd' ){
      setMenuStyle({zIndex:1000,position: 'absolute', left, top})
      setMenu(true)
      setMenu2(false)
    } else if(event.nativeEvent.target.className === 'noteHeader') {
      handleContextMenu2(event)
    }
  }
  const handleContextMenu2 = (event) => {
    const left = Number(event.target.offsetParent.style.left.replace('px','')) + Number(event.nativeEvent.offsetX)
    const top = Number(event.target.offsetParent.style.top.replace('px','')) - Number(event.nativeEvent.offsetY)
 
    setMenu2Props({id: event.nativeEvent.target.offsetParent.id, style:{position: 'absolute', left:left, top:top, zIndex:1000}})
    setMenu2(true)
    setMenu(false)
  }
  const handleAddNote = (e) => {
    e.preventDefault()
    const date = new Date()
    let top = menuStyle.top + document.getElementById('wa').offsetHeight
    props.addNote({left: menuStyle.left, top, backgroundColor:'#ffffcc', date: new Date(date.getTime()-date.getTimezoneOffset()*60*1000), author: props.user.username}, props.channel.id, props.user)
    setOpen(false)
    setMenu(false)
  }

  const handleUploadPicture = (event) => {
    event.preventDefault()
    let top = menuStyle.top + document.getElementById('wa').offsetHeight
    setUploadForm(true)
    setUploadFormStyle({zIndex:1000,position: 'absolute', left: menuStyle.left, top})
    setMenu(false)
    setMenu2(false)
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
                                      top={uploadFormStyle.top} 
                                      left={uploadFormStyle.left} 
                                      channelId={props.channel.id} 
                                      style={{...uploadFormStyle}}/>
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
                                <div className='menu' ref={menu2Ref} style={{...menu2Props.style, width:'9rem'}}>
                                    <ul className="menu-options">
                                      <li className="menu-option" onClick={handleDelete}>delete note</li>
                                      <li className="menu-option" >
                                        <div className='dropdown' >
                                          set color
                                          <div className="dropdown-content">
                                            <table style={{width:'6em',height:'6em', background:'black',border:'solid 1px #665533',cursor:'auto'}}>
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
                                <div className='menu' ref={menuRef} style={{...menuStyle, width:'9rem'}}>
                                  <ul className="menu-options">
                                    <li className="menu-option" onClick={handleAddNote}>
                                      add note
                                    </li>
                                    <li className="menu-option" onClick={handleUploadPicture}>
                                      upload picture
                                    </li>
                                  </ul>
                                </div>
                              </CSSTransition>
                            </div>
  
  const hideMenus = () => {
    setMenu(false)
    setMenu2(false) 
    setOpen(false)
  }

  let offsetX, offsetY
  let moveContent = false
	
  const move = e => {
    if(e.target.className === 'txt-mesta' || e.target.className === 'note' || e.target.className === 'noteHeader') {
      setOpen(false)
    }
		
    if(moveContent && e.target.className !== 'note') {
      document.getElementById('dndWrapper').style.left = `${e.pageX-offsetX}px`
      document.getElementById('dndWrapper').style.top = `${e.pageY-offsetY}px`

      document.getElementById('root').style.backgroundPositionX = 0.5*(e.pageX-offsetX) + 'px'
      document.getElementById('root').style.backgroundPositionY = 0.5*(e.pageY-offsetY) + 'px'
      document.getElementById('bg').style.backgroundPositionX = 0.25*(e.pageX-offsetX) + 'px'
      document.getElementById('bg').style.backgroundPositionY = 0.25*(e.pageY-offsetY) + 'px'
    }
  }
  
  const start = e => {
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

  const timeoutid = useRef(-1)
  const tip = useRef(true)

  const hideTip = useCallback(() => {
    if(!tip.current) clearTimeout(timeoutid.current)
    if(tip.current && timeoutid.current === -1)
      timeoutid.current = setTimeout(() => {
        seen.current = true
      },12000)
  },[])

  useEffect(() => {
    return () => {
      tip.current = false
      hideTip()
    }
  }, [hideTip])

  const onpointerover = (e) => {
    if(!seen.current && e.target.id === 'dnd' && !open) {
      setOpen(true)
      return
    }
    setOpen(false)
  }

  const onpointerdown = e => {
    console.log('ONPOINTERDOWN\nevent.nativeEvent.target.id:',e.nativeEvent.target.id,
    '\nevent.nativeEvent.target.className:',e.nativeEvent.target.className,'\nevent\n',e)
    setOpen(false)
    if(e.target.id === 'dnd') setZIndex('2')
  }

  if(props.notes)
    return (
      <div  id='dndWrapper' onContextMenu={handleContextMenu}
        onPointerOver={onpointerover}
        onPointerDown={onpointerdown}
        onPointerOut={() => setOpen(false)}
        onClick={hideMenus} 
        onMouseMove={move}
        onMouseDown={start}
        onMouseUp={stop}
        style={{...pos}}>
        <div className='hoverjuttu'>
          <Tooltip
            open={open}
            title='add note with the right mouse button'
            followCursor='true'
            theme='transparent'
            duration='800'
            onShown={hideTip}
          >
            <div ref={drop} id='dnd' className='dndC'
              style={{zIndex:zIndex}}
            >
              <div id='wa'>&nbsp;draggable working area</div>
              {contextMenu()}
              {contextMenu2()}
              {upload(props)}
              {props.notes.map((b,i) => (
                <Note
                  key={b.id}
                  id={b.id}
                  left={b.left}
                  top={b.top}
                  open={!open}
                  backgroundColor={b.backgroundColor}
                  author={b.author}
                  date={b.date}
                  content={b.content}
                  setOpen={setOpen}
                />
              ))}
            </div>
          </Tooltip>
          {props.pictures.map((i) => <MyImage id={i.id} key={i.id} {...i}/>)}
        </div>
      </div>
    ) 
  return <div>odota</div>
}
const mapStateToProps = (state) => {
 // console.log(state.channel)
  return {
    user: state.loggedUser,
    channel: state.channel,
    notes: state.notes,
    pictures: state.pictures
  }
}
export default connect(mapStateToProps,{addNote, setNote, deleteNote})(DnDContainer)