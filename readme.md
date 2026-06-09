# Peer-to-Peer VPN 🔐🌐

> A decentralized VPN platform built using WireGuard that enables users to create, manage, and connect secure peer-to-peer VPN tunnels without relying on centralized VPN infrastructure.

![Peer-to-Peer VPN](./screenshot.png)

---

## Overview

Peer-to-Peer VPN is a secure networking solution that allows users to establish encrypted connections directly between devices using the WireGuard protocol.

Unlike traditional VPN services that route all traffic through centralized servers, this platform enables direct peer-to-peer communication, reducing latency, improving privacy, and giving users full control over their network.

The application provides a user-friendly web interface for managing VPN peers, generating WireGuard configurations, monitoring active tunnels, and maintaining secure connections.

---

## Features

### 🔒 Secure WireGuard Tunnels

- End-to-end encrypted communication
- Modern cryptographic standards
- Lightweight and high-performance VPN protocol
- Secure peer authentication

### 👥 Peer Management

- Add and manage VPN peers
- Automatic configuration generation
- Public/Private key management
- Peer discovery and registration

### 🌐 Direct Peer-to-Peer Connectivity

- No centralized VPN routing
- Lower latency connections
- Improved privacy
- Efficient bandwidth utilization

### 📊 Tunnel Monitoring

- Active tunnel tracking
- Connection status monitoring
- Peer information management
- Tunnel configuration storage

### 🎨 Web Dashboard

- Modern responsive UI
- Easy VPN management
- Simple configuration workflow
- User-friendly interface

### 🔑 Authentication System

- User registration
- Secure login
- Session management
- Protected API routes

---

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript
- Responsive Dashboard UI

### Backend

- Node.js
- Express.js

### Security & Networking

- WireGuard
- Public/Private Key Cryptography
- Secure Tunnel Management

### Data Storage

- JSON-based Configuration Storage
- Active Tunnel Tracking
- Client Management System

---

## System Architecture

```text
+----------------------+
|        User          |
+----------+-----------+
           |
           v
+----------------------+
|   Web Dashboard      |
+----------+-----------+
           |
           v
+----------------------+
|    Node.js Server    |
+----------+-----------+
           |
    +------+------+
    |             |
    v             v
+---------+   +---------+
| WireGuard|  | Storage |
|  Engine  |  |  JSON   |
+---------+   +---------+
    |
    v
+----------------------+
| Secure P2P Tunnel    |
+----------------------+
```

---

## How It Works

1. User registers and logs into the platform.
2. A WireGuard peer configuration is generated.
3. Peer information is stored securely.
4. Users exchange public keys and connection details.
5. WireGuard establishes an encrypted tunnel.
6. Direct peer-to-peer communication begins.

---

## Project Structure

```text
peer-2-peer-VPN/
│
├── client/
│   ├── css/
│   ├── js/
│   └── assets/
│
├── controllers/
│
├── middleware/
│
├── routes/
│
├── active_tunnel.json
├── clients.json
├── provider.json
├── index.js
├── package.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/peer-2-peer-VPN.git

cd peer-2-peer-VPN
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000

JWT_SECRET=your_secret_key

SERVER_PUBLIC_IP=your_public_ip

WIREGUARD_INTERFACE=wg0
```

### Run Application

```bash
npm start
```

Development mode:

```bash
npm run dev
```

---

## API Features

### Authentication

- User Registration
- User Login
- Session Verification

### VPN Management

- Create VPN Peer
- Generate WireGuard Configuration
- Activate Tunnel
- Monitor Active Connections
- Remove Peer

---

## Example Workflow

### Create a Peer

```text
1. Register Account
2. Login
3. Create VPN Peer
4. Download WireGuard Configuration
5. Import Configuration into WireGuard Client
6. Connect Securely
```

### Establish Connection

```text
Peer A  <------Encrypted Tunnel------>  Peer B
```

---

## Security Features

- WireGuard Encryption
- JWT Authentication
- Protected Routes
- Secure Key Generation
- Peer Verification
- Configuration Isolation

---

## Advantages of Peer-to-Peer VPN

### Compared to Traditional VPNs

| Traditional VPN | Peer-to-Peer VPN |
|---------------|------------------|
| Centralized Servers | Direct Connections |
| Higher Latency | Lower Latency |
| Monthly Subscription | Self Hosted |
| Third-Party Trust Required | Full User Control |
| Shared Infrastructure | Dedicated Peer Tunnel |

---

## Future Improvements

- NAT Traversal Support
- STUN/TURN Integration
- Multi-Peer Mesh Networking
- Real-Time Analytics Dashboard
- Docker Deployment
- Kubernetes Support
- Mobile Applications
- QR-Based Configuration Sharing
- WebRTC Integration

---

## Use Cases

- Secure Remote Access
- Private Team Networks
- Home Lab Connectivity
- Remote Development Environments
- Gaming Networks
- Secure File Sharing
- Cross-Network Communication

---

## License

Licensed under the GNU General Public License v3.0 (GPL-3.0).

---

## Contributors

- Abhiraj Mishra
- Himanshu Vishwakarma

---

## Acknowledgements

This project is built on top of the WireGuard protocol, providing a modern, fast, and secure foundation for peer-to-peer networking.

> Secure. Decentralized. Fast.