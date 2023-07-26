const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../tests/test_helper')
const Blog = require('../models/blog')

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

describe('post /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'https://example.com/newBlog',
      likes: 15
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
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
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find((blog) => blog.title === 'New Blog')
    expect(addedBlog.likes).toBe(0)
  })

  test('POST /api/blogs without title and url should return 400 Bad Request with error message', async () => {
    const newBlog = {
      author: 'Author Name',
      likes: 15
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 10000)
})


afterAll( () => {
  mongoose.connection.close()
})