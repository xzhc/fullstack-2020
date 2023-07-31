const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


//get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(201).json(blogs)
})



//create a new blog into bloglist
blogsRouter.post('/',async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = await new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

//delete a existed blog
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const id  = request.params.id
  const blog = await Blog.findById(id)
  console.log('User:', user)
  console.log('Blog:', blog)
  if ( blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne({ _id: id })
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'unauthorized operation' })
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