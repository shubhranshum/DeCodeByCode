const https = require('https');

const apiHost = 'judge0-ce.p.rapidapi.com';
const apiKey = '1f3fc74d88mshdbef3dc3183be94p115014jsne8523645581f';

function submitToJudge0(code, language = 52, stdin = '') {
  return new Promise((resolve, reject) => {
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
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.token);
        } catch (err) {
          reject(new Error('Failed to parse Judge0 submission response'));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(jsonPayload);
    req.end();
  });
}

function getJudge0Result(token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: apiHost,
      path: `/submissions/${token}?base64_encoded=true&fields=*`,
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (!data) return reject(new Error('Empty response from Judge0'));

        try {
          const decoded = JSON.parse(data);
          ['stdout', 'stderr', 'compile_output'].forEach((key) => {
            if (decoded[key]) {
              decoded[key] = Buffer.from(decoded[key], 'base64').toString();
            }
          });
          resolve(decoded);
        } catch (err) {
          reject(new Error('Failed to decode Judge0 result'));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

module.exports = {submitToJudge0, getJudge0Result};