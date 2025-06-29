const https = require('https');

// Move to .env in production
const apiHost = 'judge0-ce.p.rapidapi.com';
const apiKey = 'd44ab3460dmshfb6a28c27e99da0p11e7cbjsn5208618990b4';

// --- Submit Code ---
exports.submitCode = (req, res) => {
  const { code, language = 52, stdin = '' } = req.body;
  console.log('Received submission:', { code: code?.slice(0, 100), language, stdin: stdin?.length });

  const payload = {
    language_id: language,
    source_code: Buffer.from(code).toString('base64'),
    stdin: Buffer.from(stdin).toString('base64'),
  };
  const jsonPayload = JSON.stringify(payload);

  const options = {
    method: 'POST',
    hostname: apiHost,
    path: '/submissions?base64_encoded=true&wait=false&fields=*',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-host': apiHost,
      'x-rapidapi-key': apiKey,
      'Content-Length': Buffer.byteLength(jsonPayload),
    }
  };

  const submission = https.request(options, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      console.log('Judge0 response:', data);
      try {
        const parsed = JSON.parse(data);
        res.json(parsed);
      } catch (err) {
        console.error('Failed to parse Judge0 response', err);
        res.status(500).json({ error: 'Invalid response from Judge0' });
      }
    });
  });

  submission.on('error', err => {
    console.error('Request error:', err);
    res.status(500).json({ error: 'Request failed to Judge0' });
  });

  submission.write(jsonPayload);
  submission.end();
};

exports.getResult = (req, res) => {
  const token = req.params.token;

  const options = {
    method: 'GET',
    hostname: apiHost,
    path: `/submissions/${token}?base64_encoded=true&fields=*`,
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': apiHost
    }
  };

  const resultReq = https.request(options, response => {
    let data = '';

    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        if (!data) {
          console.error("Empty response from Judge0 (getResult)");
          return res.status(500).json({ error: 'Empty response from Judge0' });
        }

        const decoded = JSON.parse(data);
        ['stdout', 'stderr', 'compile_output'].forEach(key => {
          if (decoded[key]) {
            decoded[key] = Buffer.from(decoded[key], 'base64').toString();
          }
        });

        res.json(decoded);
      } catch (err) {
        console.error('JSON parse error in getResult:', err);
        return res.status(500).json({ error: 'Failed to parse Judge0 result', raw: data });
      }
    });
  });

  resultReq.on('error', error => {
    console.error('Error in getResult:', error);
    res.status(500).json({ error: 'Failed to fetch result from Judge0' });
  });

  resultReq.end();
};
