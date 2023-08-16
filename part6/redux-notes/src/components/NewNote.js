import { createNote } from '../reducers/noteReducers'
import { useDispatch } from 'react-redux'
const NewNote = () => {
    const dispatch = useDispatch()
    const addNote = async (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        dispatch(createNote(content))
    }
    return (
        <div>
            <form onSubmit={addNote}>
                <input name='note' />
                <button type='submit'>add</button>
            </form>
        </div>
    )
}

export default NewNote
