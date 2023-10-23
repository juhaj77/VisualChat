import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'


const Clock = (props) => {
	
  const [time, setTime] = useState('')
  let timeoutId = -1

  useEffect(() => {
    updateTime(props.user)
    return () => {
      updateTime(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user])

  const updateTime = (user) => {
    const date = new Date()
    //jostain syystä tämä date onkin jo Suomiajassa
    clearTimeout(timeoutId)
    if(user){
      setTime(date.toString().slice(16,24))
      timeoutId=setTimeout(updateTime.bind(null,user),1000)
    }
  }

  return (
    <div>
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