import React from 'react'
import spinner from './Spinner.svg'

const StyledSpinner = () => {
    return <div style={{
        position: 'absolute',
        top: 'calc(50% - 100px)',
        left: 'calc(50% - 100px)'
    }}>
        <img src={spinner} alt="Loading..." />
    </div>
}
export default StyledSpinner
