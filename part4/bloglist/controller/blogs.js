const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


//get all blogs
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})


//create a new blog into bloglist
blogsRouter.post('/',async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

//delete a existed blog
blogsRouter.delete('/:id', async (request, response) => {
  const deleteBlog = await Blog.findByIdAndRemove(request.params.id)
  if ( deleteBlog) {
    return response.status(204).end()
  } else {
    return response.status(404).json({ error: 'Blog not found' })
  }
})

//update a existed blog
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )

  if ( updateBlog) {
    response.json(updateBlog)
  } else {
    response.status(404).end()
  }
})


module.exports = blogsRouter