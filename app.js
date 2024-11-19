const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = 3000;

const VIEWDNS_API_KEY = process.env.VIEWDNS_API_KEY;
const VULDB_API_KEY = process.env.VULDB_API_KEY;
const FALCONSANDBOX_API_KEY = process.env.FALCONSANDBOX_API_KEY;

let toolUsage = {
    'ipLookup': 0,
    'portScan': 0,
    'vulnerabilityScan': 0,
    'malwareAnalysis': 0
};

const upload = multer({ dest: 'public/uploads/' });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
    res.render('index', { toolUsage });
});

// IP Lookup Route
app.get('/ip-lookup', (req, res) => {
    res.render('ip-lookup');
});

app.post('/ip-lookup', async (req, res) => {
    toolUsage.ipLookup ++;
    const ip = req.body.ip;
    if (!ip) {
        return res.status(400).json({ error: 'Invalid IP address' });
    }
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Port Scanning Route
app.get('/port-scan', (req, res) => {
    res.render('port-scan');
});

app.post('/port-scan', async (req, res) => {
    toolUsage.portScan ++;
    const host = req.body.host;
    const apiKey = VIEWDNS_API_KEY;
    try {
        const response = await axios.get(`https://api.viewdns.info/portscan/?host=${host}&apikey=${apiKey}&output=json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Vulnerability Scanning Route
app.get('/vulnerability-scan', (req, res) => {
    res.render('vulnerability-scan');
});

app.post('/vulnerability-scan', async (req, res) => {
    toolUsage.vulnerabilityScan ++;
    const apiKey = VULDB_API_KEY;
    const search = req.body.search;
    try {
        const response = await axios.post('https://vuldb.com/?api', `apikey=${apiKey}&search=${search}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Malware Analysis Route
app.get('/malware-analysis', (req, res) => {
    res.render('malware-analysis');
});

app.post('/malware-analysis', upload.single('file'), async (req, res) => {
    toolUsage.malwareAnalysis ++;
    const apiKey = FALCONSANDBOX_API_KEY;
    const filePath = req.file.path;
    const environmentId = req.body.environment_id; 

    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        form.append('environment_id', environmentId);

        const submitResponse = await axios.post('https://www.hybrid-analysis.com/api/v2/submit/file', form, {
            headers: {
                ...form.getHeaders(),
                'api-key': apiKey,
                'User-Agent': 'FalconSandbox'
            }
        });

        const { sha256 } = submitResponse.data;
        fs.unlinkSync(filePath);

        // Polling for the analysis result
        const getResult = async (sha256) => {
            try {
                const resultResponse = await axios.get(`https://www.hybrid-analysis.com/api/v2/overview/${sha256}`, {
                    headers: {
                        'api-key': apiKey,
                        'User-Agent': 'FalconSandbox',
                        'accept': 'application/json'
                    }
                });
                return resultResponse.data;
            } catch (error) {
                return null;
            }
        };

        let analysisResult = null;
        const maxRetries = 10;
        let attempt = 0;

        while (!analysisResult && attempt < maxRetries) {
            attempt++;
            analysisResult = await getResult(sha256);
            if (!analysisResult) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        if (analysisResult) {
            res.json(analysisResult);
        } else {
            res.status(500).json({ error: 'Failed to retrieve analysis result' });
        }

    } catch (error) {
        fs.unlinkSync(filePath);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// API to fetch tool usage statistics
app.get('/api/tool-usage-stats', (req, res) => {
    res.json({
        usage: [
            toolUsage.ipLookup,
            toolUsage.portScan,
            toolUsage.vulnerabilityScan,
            toolUsage.malwareAnalysis
        ]
    });
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});