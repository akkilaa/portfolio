import express from 'express'
import V1 from '@api/routes/v1.router'

const app = express()

app.use(express.json())

app.get('/', (_req, res) => res.json({ status: 'ok' }))
app.use('/v1', V1)

export default app
