import React from "react";
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts:[
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }
  const Course = ({course}) => {
    const Header = ({name}) =>{
      return <h2>{name}</h2>
    }
    const Content = ({parts}) =>{
      const Part = ({name, exercises}) =>{
        return (
          <p>{name}{exercises}</p>
        )
      }
      return (
        <div>
          {parts.map(part => (
            <Part key={part.id} name={part.name} exercises={part.exercises} />
          ))}
        </div>
      )
    }
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
      </div>
    )
 }
  

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App;
