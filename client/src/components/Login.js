import React, {useState, useMemo, useRef, useEffect} from 'react'
import { connect } from 'react-redux'
import { useField } from '../hooks/field'
import { signUp } from '../reducers/usersReducer'
import Info from './Info'
import { setUser, resetUser } from '../reducers/loggedUserReducer'
import { Form, Grid } from 'semantic-ui-react'
import { GoogleLogin } from '@react-oauth/google';
import './Login.css'

const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = img.onabort = () => reject(src);
        img.src = src;
    });
}

const Login = ({user, setUser, resetUser, signUp, theme}) => {
    const username = useField('text')
    const password = useField('text')
    const [signUpProcess, setSignUpProcess] = useState(false)
    const [message, setMessage] = useState(null)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const imageSrcRef = useRef(null)

    const [isHidden, setIsHidden] = useState(false);

    const loadImage = async () => {
        try {
            /*
            Sometimes the browser loses the cached image even if it remembers the URL reference.
            This causes layout shifts and choppy animations. For this reason, a fresh image
            reference is always preloaded before animations.
             */
            imageSrcRef.current = `./visualchat.png?unique=${new Date().getTime()}`;
            await preloadImage(imageSrcRef.current);
            setIsImageLoaded(true);
        } catch (error) {
            console.error("Image failed to load", error);
        }
    }

    useEffect(() => {
        // Handle fade-in/out logic
        if (!user && !window.localStorage.getItem('loggedChatUser')) {
            setIsHidden(false); // Show component
            loadImage(); // Preload image
        } else {
            setIsImageLoaded(false); // Trigger fade-out
            // Sometimes onTransitionEnd timing fails
            const fadeOutTimer = setTimeout(() => {
                setIsHidden(true); // Ensure it's hidden after fade-out ends
            }, 1000); // Match CSS transition timing (1s)
            return () => clearTimeout(fadeOutTimer); // Cleanup to avoid stale timers
        }
    }, [user]);

    useEffect(() => {
        const syncLoggedUser = () => {
            const loggedUserJSON = window.localStorage.getItem('loggedChatUser');
            if (loggedUserJSON) {
                try {
                    const user = JSON.parse(loggedUserJSON);
                    resetUser(user); // Resets the user in the parent or redux
                } catch (error) {
                    console.error('Failed to parse logged user:', error);
                }
            }
        };

        syncLoggedUser(); // Initial fetch
        window.addEventListener('storage', syncLoggedUser);

        return () => {
            window.removeEventListener('storage', syncLoggedUser); // Cleanup
        };
    }, [resetUser]);


    const handleSuccess = (credentialResponse) => {
        if (credentialResponse.credential) {
            setUser({idToken: credentialResponse.credential})
        }
    }

    const shouldShowLogin = useMemo(() => !user && isImageLoaded,
    [user, isImageLoaded])

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
        if (signUpProcess) {
            setMessage({ content: `account created for user: ${username.input.value}!`, color: 'green' })
            return
        }
        setMessage(null)
    }

    const handleLogin = (e) => {
        handleInputs(e, setUser)
        username.reset()
        password.reset()
    }

    const handleSignUp = async (e) => {
        await handleInputs(e, signUp)
        setSignUpProcess(false)
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
            <div style={{display: 'flex', justifyContent: 'space-between', gap: '1em'}}>
                <button className={'myButton ' + theme} autoFocus type="submit">{buttonText}</button>
                {signUpProcess && <button className={'myButton ' + theme} onClick={() => setSignUpProcess(false)}
                                          type="button">Cancel</button>}
            </div>
        </Form>
    )
    const options = () => (
        <div>
            <Grid columns={3} style={{ paddingLeft: '3em', paddingRight: '3em',paddingBottom:'2em'}} relaxed='very' stackable >
                <Grid.Column>
                    {form('Login', handleLogin)}
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                    <button className={'myButton '+theme} onClick={() => setSignUpProcess(true)} type='button'>Sign up</button>
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        onSuccess={handleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </Grid.Column>
            </Grid>
        </div>
    )

    return !isHidden && <div  className={`login ${shouldShowLogin ? "show" : ""}`}
                              style={{ opacity: shouldShowLogin ? 1 : 0}}
    >
        <img alt={'Visual Chat'}
             style={{
                 width:'100%', paddingTop: '7vh',
             }}
             src={imageSrcRef.current} />
        <div className={'loginsegment '+theme} >
            {!signUpProcess && options()}
            {signUpProcess && form('Sign Up', handleSignUp)}
        </div>
        <Info message={message} />
    </div>
}

const mapStateToProps = (state) => {
    return {
        user: state.loggedUser,
    }
}
export default connect(mapStateToProps, { setUser, resetUser, signUp })(Login)