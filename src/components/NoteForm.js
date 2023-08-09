import { useState } from 'react'


const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  //处理笔记内容改变的事件
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  //处理添加新表单笔记的提交
  const handleSubmit = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: false
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={handleSubmit}>
        <input value={newNote} onChange={handleNoteChange} placeholder='write here note content'/>
        <button type="submit">save</button>
      </form>
    </div>
  )
}


export default NoteForm