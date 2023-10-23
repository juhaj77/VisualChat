import React, { useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import Login from './components/Login'
import Chat from './components/Chat'
import './App.css'

const App = () => {
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return loading ? 
    <div style={{width:'100vw',height:'100vh',background:'black'}}>
      <span style={{position:'absolute',top:'50%',left:'50%',fontSize:'2em',color:'#b29966',marginLeft:'-5rem'}}>
    loading...
      </span>
    </div> : 
    <Container id='cont' style={{width:'100%',height:'100vh'}}>
      <Login/>
      <Chat />
    </Container>
}

export default App