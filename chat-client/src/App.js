import React, { useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import Login from './components/Login'
import Chat from './components/Chat'
import './App.css'
import StyledSpinner from './components/StyledSpinner'

const App = () => {
  const [ loading, setLoading ] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [showViewWarning, setShowViewWarning] = useState(false)

  useEffect(() => {
    setLoading(false)
    if(window.innerWidth <= 800) setShowViewWarning(true)
  }, [])

  if(showViewWarning) return <div
                              style={{
                                textAlign:'center',
                                padding:'8em'}}>
                                <span style={{
                                    color:'red',
                                    fontSize:'2em',
                                    fontWeight:'700'}}>
                                      Your view is too small. This is for desktop use only.
                                </span>
                              </div>

  return loading ? 
    <StyledSpinner/> : 
    <Container id='cont' style={{width:'100%',height:'100vh'}}>
      <Login theme={theme}/>
      <Chat setTheme={setTheme} theme={theme}/>
    </Container>
}

export default App