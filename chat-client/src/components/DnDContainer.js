import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDrop } from 'react-dnd'
import Note from './Note'
import MyImage from './Image'
import {addNote, setNote, deleteNote} from '../reducers/noteReducer'
import { useTransition, animated } from 'react-spring'
import { connect } from 'react-redux'
import UploadForm from './UploadForm'
import map from './noteColors'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import './DnD.css'


const DnDContainer = (props) => {
        
  const [menu, setMenu] = useState({visible: false}) 
  const [menu2, setMenu2] = useState({visible: false})
  const [uploadForm, setUploadForm] = useState({visible: false})
  const [pos, setPos] = useState({left:'0px',top:'0px'})
  const [open, setOpen] = useState(undefined)
  const seen = useRef(false)
  const [zIndex, setZIndex] = useState('5')
    
  const transitions = useTransition(menu.visible || menu2.visible || uploadForm.visible, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const [, drop] = useDrop({
    accept: ['note', 'image'],
    drop(item, monitor) {
      console.log(item,monitor)
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
    console.log('handleContextMenu', event.target)
    event.preventDefault()
    if(menu.visible || menu2.visible){
      setMenu2({visible: false})
      setMenu({visible: false})
      return
    }
    if(event.target.id === 'dnd2'){
      let top = event.nativeEvent.offsetY - document.getElementById('wa').offsetHeight
      //let top = event.nativeEvent.offsetY + document.getElementById('wa').offsetHeight
      console.log( top, event.nativeEvent.offsetX)
      setMenu({visible: true, style:{zIndex:1000,position: 'absolute', left:event.nativeEvent.offsetX, top}})
      setMenu2({visible: false})
    } else if(event.nativeEvent.target.className !== 'txt-mesta' && event.nativeEvent.target.id !== 'wa') {
      handleContextMenu2(event)
    }
  }
  const handleContextMenu2 = (event) => {
    console.log('handleContextMenu2')
    const left = Number(event.target.offsetParent.style.left.replace('px','')) + Number(event.nativeEvent.offsetX)
    const top = Number(event.target.offsetParent.style.top.replace('px','')) - Number(event.nativeEvent.offsetY)
 
    setMenu2({visible: true, id: event.nativeEvent.target.offsetParent.id, style:{position: 'absolute', left:left, top:top, zIndex:1000}})
    setMenu({visible: false})
  }
  const handleAddNote = (e) => {
    console.log(props.channel)
    e.preventDefault()
    const date = new Date()
    let top = menu.style.top + document.getElementById('wa').offsetHeight
    props.addNote({left: menu.style.left, top, backgroundColor:'#ffffcc', date: new Date(date.getTime()-date.getTimezoneOffset()*60*1000), author: props.user.username}, props.channel.id, props.user)
    setOpen(false)
    setMenu({visible: false})
  }

  
  const handleUploadPicture = (event) => {
   // uploadFormVisible.current = true
    event.preventDefault()
    let top = menu.style.top + document.getElementById('wa').offsetHeight
    console.log('top',top,'left',menu.style.left)
    const um = {visible: true,style:{zIndex:1000,position: 'absolute', left: menu.style.left, top}}
    setUploadForm(um)
    console.log(uploadForm)
    setMenu({visible: false})
    setMenu2({visible: false})
  }



  const handleDelete = (e) => {
    e.preventDefault()
    props.deleteNote(menu2.id, props.channel.id, props.user)
  }
  const setColor = (e) => {
    e.preventDefault()
    const note= props.notes.find(n => n.id === menu2.id)
    props.setNote({...note, backgroundColor: e.nativeEvent.target.id}, props.channel.id, props.user)
    hideMenus()
  }
  const contextMenu2 = () => (
    transitions.map(({ item, key, props }) =>
      item && <animated.div className='menu' key={key} style={{...menu2.style, width:'9rem',...props}}>
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
      </animated.div>  
    )
  )
  const contextMenu = () => (
    transitions.map(({ item, key, props }) =>
      item && <animated.div className='menu' key={key} style={{...menu.style, width:'9rem',...props}}>
        <ul className="menu-options">
          <li className="menu-option" onClick={handleAddNote}>
            add note
          </li>
          <li className="menu-option" onClick={handleUploadPicture}>
            upload picture
          </li>
        </ul>
      </animated.div> 
    )
  )
  const hideMenus = () => {
    setMenu({visible: false})
    setMenu2({visible: false})
   // setUploadForm({visible:  false})
    
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
  const o = useRef(true)

  const hideTip = useCallback(() => {
    if(!o.current) clearTimeout(timeoutid.current)
    if(o.current && timeoutid.current === -1)
      timeoutid.current = setTimeout(() => {
        seen.current = true
      },12000)
  },[])

  useEffect(() => {
    return () => {
      o.current = false
      hideTip()
    }
  }, [hideTip])

  useEffect(() => {
    console.log(zIndex)
  }, [zIndex])

  const onpointerover = (e) => {
    if(!seen.current && e.target.id === 'dnd' && !open) {
      console.log('mitä vittuu')
      setOpen(true)
      return
    }
    setOpen(false)
  }

  const onpointerdown = e => {
    console.log(e)
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
          <div id='dnd2' className='dndC' style={{zIndex:'3'}} ></div>
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
              {menu.visible && contextMenu()}
              {menu2.visible && contextMenu2()}
              {uploadForm.visible && <UploadForm setVisible={setUploadForm} top={uploadForm.style.top} left={uploadForm.style.left} channelId={props.channel.id} style={{...uploadForm.style}}/>}
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