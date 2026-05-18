import { createApp } from './src/container.js'

const { app, dispose } = createApp()

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const server = app.listen(port, () => console.log(`API listening on port ${port}`))

const shutdown = async () => {
  server.close()
  await dispose()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
