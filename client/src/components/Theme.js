import React, { useEffect } from 'react'
import './Chat.css'
import './DnD.css'
import './switch.css'

const Theme = (props) =>  {

   const handleTheme = e => {
     if(e.target.checked) {
         props.setTheme('light')
     } else {
          props.setTheme('dark')
        }
      }

    useEffect(() =>{
        if(props.theme ==='light' || document.getElementById('themeselector').checked == true) {
          document.getElementById('themeselector').checked=true
          props.setTheme('light')
        } 
    })

return <div style={{display:'inline-block'}}>
         <table style={{borderCollapse:'collapse',float:'left',height:'18px',paddingTop:'1em'}}>
            <tbody>
              <tr className={'themeselect '+ props.theme} style={{lineHeight:'18px',height:'18px'}}>
                <td className='prevent-select'>theme: dark</td>
                <td style={{padding:'0 .5em 0 .5em'}}>
                <label className="switch">
                <input id='themeselector' type="checkbox" onChange={handleTheme}/>
                <span className="slider round"></span>
                </label>
                </td>
                <td className='prevent-select' style={{paddingRight:'0.4em'}}>light</td>
               </tr>
              </tbody>
             </table>
            </div>
}

export default Theme