import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and call onSubmit', async () => {
  //创建一个模拟的createNote函数
  const createNote = jest.fn()

  //渲染NoteForm组件，并将模拟的createNote传递给它
  render(<NoteForm createNote={createNote} />)

  //获取输入框和提交按钮
  const input = screen.getByPlaceholderText('write here note content')
  const sendButton = screen.getByText('save')

  //输入框中输入文本并点击按钮
  await userEvent.type(input, 'testing a form...')
  await userEvent.click(sendButton)

  //createNote函数应该被调用一次
  expect(createNote.mock.calls).toHaveLength(1)

  //调用createNote函数的第一个参数的content属性应该是正确的
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})