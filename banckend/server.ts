import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT ?? 3000;

app.use(cors())

app.post('/api/files', (req, res) => {
    return res.status(200).json({"message": "Files upload successfully."})
})

app.get('/api/users', (req, res) => {
    return res.status(200).json({ data: [] });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})