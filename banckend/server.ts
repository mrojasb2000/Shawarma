import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3000
const storage = multer.memoryStorage()
const upload = multer({ storage })

let userData: Array<Record<string, string>> = []

app.use(cors())

app.post('/api/files', upload.single('file'), async (req, res) => {
    const {file} = req
    if (!file) {
        return res.status(500).json({ message: "File is required" });    
    }
    if (file.mimetype != 'text/csv') {
        return res.status(500).json({ message: "File must be CSV" });    
    }
    let json: Array<Record<string, string>> = [];
    try {
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        json = csvToJson.csvStringToJson(rawCsv);
    } catch (error) {
         return res.status(500).json({ message: "Error parsing the file" }); 
    }
    userData = json;
    return res.status(200).json({ data: userData, "message": "Files upload successfully."})
})

app.get('/api/users', async (req, res) => {
    const { q } = req.query
    if (!q) {
        return res.status(500).json({ message: "Query param `q` is required" }); 
    }
    if (Array.isArray(q)) {
        return res.status(500).json({ message: "Query param `q` must be a string" }); 
    }
    const search = q.toString().toLowerCase()
    const filteredData = userData.filter(row => {
        Object.values(row).some(value => value.toLowerCase().includes(search))
    })  
    return res.status(200).json({ data: filteredData });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})