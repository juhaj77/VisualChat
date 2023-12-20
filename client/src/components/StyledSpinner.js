import React from 'react'
import spinner from './Spinner.svg'

const StyledSpinner = () => {
    return <div style={{
        position: 'absolute',
        top: '43%',
        left: '45%'
    }}>
        <img src={spinner} alt="Loading..." />
    </div>
}
export default StyledSpinner
