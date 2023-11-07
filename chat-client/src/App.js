import React, { useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import Login from './components/Login'
import Chat from './components/Chat'
import './App.css'
import StyledSpinner from './components/StyledSpinner'

const App = () => {
  const [ loading, setLoading ] = useState(true)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    setLoading(false)
  }, [])

  return loading ? 
    <StyledSpinner/> : 
    <Container id='cont' style={{width:'100%',height:'100vh'}}>
      <Login theme={theme}/>
      <Chat setTheme={setTheme} theme={theme}/>
    </Container>
}

export default App