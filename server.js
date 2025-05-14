// A custom Next.js server for cPanel deployment
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Get port from environment or default to 3000
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'

// Initialize Next.js app
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the request URL
      const parsedUrl = parse(req.url, true)
      
      // Let Next.js handle the request
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${port}`)
  })
})
