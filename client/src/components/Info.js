import React, {useState, useEffect} from 'react'

const Info = ({message}) => {
    const [text, setText] = useState(message);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setText(message);
            setShow(true);

            return () => setShow(false);
        }
    }, [message]);

    return (
        <div
            style={{
                color: text?.color,
                backgroundColor: show ? 'rgb(0,0,1)' : 'black',
                border: show ? `1px solid ${text?.color}` : 'none',
                borderRadius: '6px',
                padding: show ? '1em' : 0,
                fontSize: '1.2em',
                margin: '0em',
                opacity: show ? 1 : 0,
                transition: 'opacity 250ms ease-in-out, padding 250ms ease-in-out, border 250ms ease-in-out, background-color 5s ease-in-out',
            }}
            onTransitionEnd={(e) => {
                if(e.propertyName === 'background-color') setShow(false)}}
        >
            {show && text?.content}
        </div>
    );
};

export default Info;