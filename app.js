const WebSocket = require('ws');
const http = require('http');

// Configuration
const {
  TARGET_SERVER = 'ws://:7878',
  PORT = 8080 //не меняй
} = process.env;

// Create HTTP and WebSocket servers
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (clientSocket, req) => {
  // Connect to the target WebSocket server
  const proxySocket = new WebSocket(TARGET_SERVER);

  // Forward messages from client to target
  clientSocket.on('message', (msg) => {
    if (proxySocket.readyState === WebSocket.OPEN) {
      proxySocket.send(msg);
    }
  });

  // Forward messages from target to client
  proxySocket.on('message', (msg) => {
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(msg);
    }
  });

  // Handle client socket close or error
  const cleanupClient = () => {
    if (proxySocket.readyState === WebSocket.OPEN) {
      proxySocket.close();
    }
  };
  clientSocket.on('close', cleanupClient);
  clientSocket.on('error', (err) => {
    console.error('Client error:', err);
    cleanupClient();
  });

  // Handle proxy socket close or error
  const cleanupProxy = () => {
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.close();
    }
  };
  proxySocket.on('close', cleanupProxy);
  proxySocket.on('error', (err) => {
    console.error('Proxy error:', err);
    cleanupProxy();
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
