const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const helper = require('../tests/test_helper')
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}, 20000)

describe('When there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body) .toHaveLength(helper.initialBlogs.length)
  }, 10000)

  test('blogs have id property instead of __id', async () => {
    const response = await api.get('/api/blogs')

    const ids = response.body.map((blog) => blog.id)

    for(const id of ids) {
      expect(id).toBeDefined()
    }
  }, 10000)

  test('a special blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)
    expect(titles).toContain('First class tests')
  }, 10000)

})

describe('addition of a new blog', () => {
  //在每个测试之前创建一个有效的令牌
  let token = null
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)
    const user = await new User({ username: 'name', passwordHash }).save()

    const userForToken = { username: 'name', id: user.id }

    return (token = jwt.sign(userForToken, config.SECRET))
  })

  test('a valid blog can be added by authorized user', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'https://example.com/newBlog',
      likes: 15
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).toContain('New Blog')
  })

  test('likes property defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'https://example.com/newBlog'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('POST /api/blogs without title and url should return 400 Bad Request with error message', async () => {
    const newBlog = {
      author: 'Author Name',
      likes: 15
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 10000)

})

describe('deletion a blog', () => {
  //在每个测试之前创建一个有效的令牌
  let token = null
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)
    const user = await new User({ username: 'name', passwordHash }).save()

    const userForToken = { username: 'name', id: user.id }

    token = jwt.sign(userForToken, config.SECRET)

    const newBlog = {
      title: 'some blog',
      author: 'some author',
      url: 'https://www.example.com'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    return token
  })

  test('DELETE /api/blogs/:id should delete a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb().populate('user')
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb().populate('user')

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 401 if user is not authorized', async () => {
    const blogsAtStart = await Blog.find({}).populate('user')
    const blogToDelete = blogsAtStart[0]

    token = null

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await Blog.find({}).populate('user')

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtStart).toEqual(blogsAtEnd)
  })
})


describe('update /api/blogs', () => {
  test('PUT /api/blogs/:id should update a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updateBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updateBlogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
    expect(updateBlogAtEnd.likes).toBe(blogToUpdate.likes + 1)
  })
})

afterAll( () => {
  mongoose.connection.close()
})