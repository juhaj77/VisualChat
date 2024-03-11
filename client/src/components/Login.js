import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { useField } from '../hooks/field'
import { signUp } from '../reducers/usersReducer'
import { setGapi } from '../reducers/gapiReducer'
import Info from './Info'
import { setUser, clearUser, resetUser } from '../reducers/loggedUserReducer'
import { useTransition, animated } from 'react-spring'
import styled from 'styled-components'
import { Form, Grid } from 'semantic-ui-react'
import { loadGapiInsideDOM, loadAuth2 } from 'gapi-script'
import './Login.css'

const src = require('./visualchat.png')

const Div = styled.div`
animation-name: backGroundAnim;
animation-timing-function:ease-in;
animation-duration:0.05s;
width:100vw;
height:100vh;
@keyframes backGroundAnim {
from {background-color:black;}
to {background-color:rgba(0,0,0,0);}
}`

const Login = (props) => {
  const username = useField('text')
  const password = useField('password')
  const [signUp, setSignUp] = useState(false)
  const [message, setMessage] = useState(null)
  const [loaded, setLoaded] = useState(false)
  
  const [count, setCount] = useState(0)
  const isLoaded = useRef(false)

  useEffect(() => {
    const setU = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedChatUser')
      if (loggedUserJSON) {
        try {
          const user = await JSON.parse(loggedUserJSON)
          await props.resetUser(user)
        } catch (e) { console.log(e.name) }
      }
    }
    setU()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // for logout img is not always loaded and panel loading is not smooth. 
  // this is testing/developing code
  const img = new Image()
  console.log('img.complete',img.complete)
  useEffect(() => {
    img.src = src
    img.onload = () => {
      setLoaded(true)
      isLoaded.current = true
    }
    return () => {
     // setLoaded(false) for unknown reason this makes weird behaviour
      isLoaded.current = false
      console.log('useEffect '+ count+ ' '+loaded+' '+isLoaded.current+' '+img.complete,'\n',img)
      setCount(count + 1)
      
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[props.user]);

  const theme = props.theme
  //////////////////////////GOOGLE/////////////////////////////////
  const [user, setUser] = useState(null);
  const CLIENT_ID='371216924606-rgdtfalqj9tklp61rkv27d9ii14cenbe.apps.googleusercontent.com'
  useEffect(() => {
    const loadGapi = async () => {
      const newGapi = await loadGapiInsideDOM();
      props.setGapi(newGapi)
    }
    loadGapi();
  }, [props.gapi]);
  useEffect(() => {
    if (!props.gapi) return;

    const setAuth2 = async () => {
      const auth2 = await loadAuth2(props.gapi, CLIENT_ID, '')
      if (auth2.isSignedIn.get()) {
        updateUser(auth2.currentUser.get())
      } else {
        attachSignin(document.getElementById('customBtn'), auth2);
      }
    }
    setAuth2();
  }, [props.gapi]);

  useEffect(() => {
    if (!props.gapi) return;

    if (!user) {
      const setAuth2 = async () => {
        const auth2 = await loadAuth2(props.gapi, CLIENT_ID, '')
        attachSignin(document.getElementById('customBtn'), auth2);
      }
      setAuth2();
    }
  }, [user, props.gapi, loaded])

  const updateUser = (currentUser) => {
    const name = currentUser.getBasicProfile().getName();
    const profileImg = currentUser.getBasicProfile().getImageUrl();
    const email = currentUser.getBasicProfile().getEmail();
    const id = currentUser.getBasicProfile().getId()
    setUser({
      name: name,
      profileImg: profileImg,
      email: email,
      id: id
    });
    // server validates this:
    props.setUser({
      idToken: currentUser.xc.id_token,
    })
  };

  const attachSignin = (element, auth2) => {
    auth2.attachClickHandler(element, {},
      (googleUser) => {
        updateUser(googleUser);
      }, (error) => {
        console.log(JSON.stringify(error))
      });
  };

  const signOut = () => {
    const auth2 = props.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setUser(null);
      console.log('User signed out.');
    });
  }
  //////////////////////////////////////////////////////////////
 
  const transitions = useTransition((!window.localStorage.getItem('loggedChatUser') || !props.user) && loaded && img.complete, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })
  const handleInputs = async (event, func) => {
    event.preventDefault()
    try {
      if (!username.input.value || username.input.value.trim().length < 3) {
        setMessage({ content: 'valid username is required (min length is 3)', color: 'red' })
        return
      }
      if (!password.input.value || password.input.value.length < 3) {
        setMessage({ content: 'valid password is required (min length is 3)', color: 'red' })
        return
      }
      const credentials = {
        username: username.input.value.trim(), password: password.input.value
      }
      await func(credentials)
    } catch (exception) {
      setMessage({ content: exception.message, color: 'red' })
      return
    }
    if (signUp) {
      setMessage({ content: `account created for user: ${username.input.value}!`, color: 'green' })
      return
    }
    setMessage(null)
  }

  const handleLogin = (e) => {
    handleInputs(e, props.setUser)
  }
  const handleSignUp = async (e) => {
    await handleInputs(e, props.signUp)
    setSignUp(false)
    username.reset()
    password.reset()
  }


  const form = (buttonText, eventHandler) => (
    <Form inverted style={{ padding:'2em 2em 1em 2em', maxWidth:'20em',margin:'auto' }} onSubmit={eventHandler} >
      <Form.Input
        icon='user'
        iconPosition='left'
        label='Username'
        placeholder='Username'
        {...username.input}
      />
      <Form.Input
        icon='lock'
        iconPosition='left'
        label='Password'
        style={{ marginBottom: '0.5em' }}
        {...password.input}
      />
      <button className={'myButton '+theme} autoFocus type="submit">{buttonText}</button>
    </Form>
  )
  const options = () => (
    <div >
      <Grid columns={3} style={{ paddingLeft: '3em', paddingRight: '3em',paddingBottom:'2em'}} relaxed='very' stackable >
        <Grid.Column>
          {form('Login', handleLogin)}
        </Grid.Column>
        <Grid.Column verticalAlign='middle'>
          <button className={'myButton '+theme} onClick={() => setSignUp(true)} type='button'>Sign up</button>
        </Grid.Column>
        <Grid.Column verticalAlign='middle'>
          <button id="customBtn" className={'myButton '+theme} style={{whiteSpace:'nowrap'}} >
            Google Login
          </button>
        </Grid.Column>
      </Grid>
    </div>
  )

  return loaded ? transitions.map(({ item, key, props }) =>
    item && <animated.div key={key} style={props}>
      <div className='login'>
      <img style={{width:'100%', paddingTop: '7vh' }} src={src} />
        <div className={'loginsegment '+theme} >
          {!signUp && options()}
          {signUp && form('Sign Up', handleSignUp)}
        </div>
        <Info message={message} clear={() => setMessage(null)} />
      </div>
    </animated.div>) :
    <Div></Div>
}
// style={{padding:'0',margin:'0',width:'100%',backgroundColor:'black',border:'solid 1px #665533'}} placeholder
const mapStateToProps = (state) => {
  return {
    user: state.loggedUser,
    gapi: state.gapi
  }
}
export default connect(mapStateToProps, { setUser, clearUser, resetUser, signUp, setGapi })(Login)