import React from "react";
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
 
export default Course