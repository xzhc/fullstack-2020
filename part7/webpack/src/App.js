import { useState, useEffect } from 'react'
import React from "react"
import axios from 'axios'
import './index.css'
import PromisePolyfill from 'promise-polyfill'

if ( !window.Promise) {
    window.Promise == PromisePolyfill
}

const useNote = (url) => {
    const [notes, setNotes] = useState([])
    useEffect(() => {
        axios.get(url).then(response => {
        setNotes(response.data)
        })
    }, [url])
  return notes
}
const App = () => {

    const [counter, setCounter] = useState(0)
    const [values, setValues] = useState([])
    const notes = useNote(BACKEND_URL)
    const handleClick = () => {
        setCounter(counter + 1)
        setValues(values.concat(counter))
    }
    return (
        <div className="container">
            hello webpack {counter} clicks
            <button onClick={handleClick}>press</button>
            <div>{notes.length} notes on server {BACKEND_URL}</div>
        </div>
    )
}

export default App