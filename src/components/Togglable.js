import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  //定义显示和隐藏内容的样式
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  //切换内容的可见性
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility: toggleVisibility
  }))

  return (
    <div>
      {/* 内容隐藏时显示按钮 */}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      {/* 内容显示时子组件和取消按钮 */}
      <div style={showWhenVisible} className='togglableContent'>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
Togglable.displayName= 'Togglable'
export default Togglable