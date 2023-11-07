import React, {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import './DnD.css'


const Clock = (props) => {
	
  const [time, setTime] = useState('')
  const timeoutId = useRef(0)

  useEffect(() => {
    updateTime(props.user)
    return () => {
      clearTimeout(timeoutId.current)
      updateTime(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user])

  const updateTime = (user) => {
    const date = new Date()
    //jostain syystä tämä date onkin jo Suomiajassa
    clearTimeout(timeoutId.current)
    if(user){
      setTime(date.toString().slice(16,24))
      timeoutId.current=setTimeout(updateTime.bind(null,user),1000)
    }
  }

  return (
    <div className='prevent-select'>
      {time}
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.loggedUser
  }
}
export default connect(mapStateToProps,null)(Clock)