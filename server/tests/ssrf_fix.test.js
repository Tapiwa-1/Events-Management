import http from 'http';
import axios from 'axios';
import { spawn } from 'child_process';

const MOCK_PORT = 9999;
const SERVER_PORT = 3000;
const VULNERABLE_ENDPOINT = `http://localhost:${SERVER_PORT}/api/events/import-sheet`;

const mockServer = http.createServer((req, res) => {
    console.log(`[MOCK SERVER] Received request: ${req.method} ${req.url}`);
    if (req.url === '/secret.csv') {
        console.error('VULNERABILITY CONFIRMED: Backend accessed internal mock server!');
        res.writeHead(200, { 'Content-Type': 'text/csv' });
        res.end('header1,header2\nval1,val2');
        // We must kill the server process here too
        if (global.serverProcess) global.serverProcess.kill();
        process.exit(1);
    } else {
        res.writeHead(404);
        res.end();
    }
});

mockServer.listen(MOCK_PORT, async () => {
    console.log(`[MOCK SERVER] Listening on port ${MOCK_PORT}`);

    console.log('[TEST] Starting backend server...');
    const serverProcess = spawn('node', ['server/index.js'], { stdio: 'pipe' });
    global.serverProcess = serverProcess; // Make available for cleanup

    serverProcess.stdout.on('data', (data) => {
         const str = data.toString();
         if (str.includes('Server listening')) {
             console.log('[TEST] Backend server is ready.');
         }
    });

    serverProcess.stderr.on('data', (data) => console.error(`[BACKEND ERROR]: ${data}`));

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        console.log('[TEST] Sending malicious request...');
        await axios.post(VULNERABLE_ENDPOINT, {
            url: `http://localhost:${MOCK_PORT}/secret.csv`
        });
        console.error('[TEST] Request completed successfully (Should have failed with 400).');
        serverProcess.kill();
        mockServer.close();
        process.exit(1);
    } catch (error) {
        serverProcess.kill();
        mockServer.close();

        if (error.response) {
            console.log(`[TEST] Server responded with status: ${error.response.status}`);
            if (error.response.status === 400 && error.response.data.error && error.response.data.error.includes('Invalid URL')) {
                console.log('[TEST] SUCCESS: Server blocked the request with 400 Invalid URL.');
                process.exit(0);
            } else {
                console.error(`[TEST] FAILURE: Expected 400 Invalid URL, got ${error.response.status} ${JSON.stringify(error.response.data)}`);
                process.exit(1);
            }
        } else {
            console.error(`[TEST] Request failed with unexpected error: ${error.message}`);
            process.exit(1);
        }
    }
});
