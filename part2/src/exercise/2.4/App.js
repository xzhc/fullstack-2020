import React from "react";
const App = () => {
  const courses = 
  [
    {
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
  },
  {
    name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
  }
]
  const Course = ({courses}) => {
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
    const Total = ({parts}) => {
      const totalExercise = parts.reduce((sum, part) => sum + part.exercises, 0) 
      return (
        <div>
          <p>total of {totalExercise} exercises</p>
        </div>
      )
    }
    return (
      <div>
        <Header name={courses[0].name} />
        <Content parts={courses[0].parts} />
        <Total parts={courses[0].parts} />
        <Header name={courses[1].name} />
        <Content parts={courses[1].parts} />
        <Total parts={courses[1].parts} />
      </div>
    )
 }
  

  return (
    <div>
      <Course course={courses} />
    </div>
  )
}

export default App;
