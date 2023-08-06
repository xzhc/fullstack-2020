import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Note from './components/Note'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import noteService from './service/notes'
import loginService from './service/login'
import NoteForm from './components/NoteForm'

const App = () => {
  //使用useState定义状态变量
  const [notes, setNotes] = useState([])

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)


  const [user, setUser] = useState(null)


  //使用useEffect定义副作用
  useEffect(() => {
    //在组件挂载时获取所有的笔记，并设置notes的状态
    noteService.getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  //使用useEffect处理页面的加载
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedNoteappUser')
    if ( loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      noteService.setToken(user.token)
    }
  } ,[])

  const noteFormRef = useRef()

  //处理登录表单的提交
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addNote = (noteProject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteProject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }



  //根据notes的状态过滤要显示的笔记
  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  //处理笔记重要性的切换
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // 调用服务的 update 方法更新笔记的重要性
    noteService.update(id, changedNote)
      .then(returnedNote => {
      //更新notes状态，将修改后的笔记替换原来的笔记
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => {
      //如果更新失败，设置错误消息
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        //更新notes状态，移除原来的笔记
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    //渲染组件
    <div>
      <h1>Notes app</h1>
      <Notification message = {errorMessage} />

      {!user && <Togglable buttonLabel = 'log in'>
        <LoginForm handleLogin={handleLogin}/>
      </Togglable>
      }
      {user && <div>
        <p>{user.name} logged in</p>
        <Togglable buttonLabel='new note' ref={noteFormRef}>
          <NoteForm createNote={addNote}/>
        </Togglable>
      </div>
      }


      {/* 切换显示全部或重要的笔记 */}
      <div>
        <button onClick={ () => {setShowAll(!showAll)}}>show {showAll ? 'important' : 'all'}</button>
      </div>


      {/* 渲染笔记列表 */}
      <h2>Notes</h2>
      <ul>
        {notesToShow.map((note) => (<Note key={note.id} note={note} toggleImportance={ () => toggleImportanceOf(note.id)}
        />
        ))}
      </ul>



      <Footer />
    </div>
  )
}

export default App
