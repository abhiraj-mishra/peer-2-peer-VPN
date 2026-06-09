# Peer-to-Peer VPN Marketplace 🔐🌐

> A decentralized WireGuard-based VPN marketplace that connects VPN Providers (Exit Nodes) with Clients through automatically generated peer-to-peer configurations.

## Overview

Peer-to-Peer VPN Marketplace is a platform that allows users to monetize their internet connection by acting as VPN providers while enabling clients to securely connect through WireGuard tunnels.

Unlike traditional VPN services that rely on centralized servers, this platform acts as a control plane that coordinates secure connections between independent providers and clients.

The system manages:

- Provider registration
- WireGuard key exchange
- Configuration generation
- Tunnel management
- Connection verification
- Marketplace listings

WireGuard itself handles the encrypted VPN tunnel while the platform handles peer discovery and coordination. :contentReference[oaicite:0]{index=0}

---

## How It Works

### Provider Workflow

1. Generate a WireGuard key pair.
2. Register on the platform.
3. Submit:
   - Public IP Address
   - WireGuard Public Key
   - Listening Port
   - Pricing Information
4. Enable port forwarding on the router.
5. Become available in the marketplace.

### Client Workflow

1. Browse available VPN providers.
2. Select a provider.
3. Submit WireGuard Public Key.
4. Download generated WireGuard configuration.
5. Import configuration into WireGuard.
6. Connect securely through the selected provider.

The platform automatically generates peer configurations for both parties and establishes a secure tunnel. :contentReference[oaicite:1]{index=1}

---

## Features

### VPN Marketplace

- Provider listings
- Node selection
- Provider pricing
- Connection management

### WireGuard Integration

- Automatic configuration generation
- Public key management
- Peer configuration
- Tunnel establishment

### Authentication

- User registration
- User login
- Protected routes
- Session management

### Connection Verification

- Active tunnel validation
- Handshake monitoring
- Connection status tracking

### Dashboard

- Provider dashboard
- Client dashboard
- Active tunnel monitoring
- Marketplace management

---

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### VPN Protocol

- WireGuard

### Storage

- JSON-based storage
- Client records
- Provider records
- Active tunnel tracking

---

## Architecture

```text
Client
   |
   v
Marketplace Platform
(Control Plane)
   |
   +----------------+
   |                |
   v                v
Provider        Configuration
 Node           Generator
   |
   v
WireGuard Tunnel
(Client <----> Provider)
```

The platform coordinates connections but does not route traffic itself. WireGuard handles the encrypted communication between peers. :contentReference[oaicite:2]{index=2}

---

## Project Structure

```text
peer-2-peer-VPN/
│
├── client/
├── controllers/
├── middleware/
├── routes/
│
├── active_tunnel.json
├── clients.json
├── provider.json
│
├── index.js
├── package.json
└── README.md
```

---

## Running the Application

This project consists of:

- Backend Server (Node.js + Express)
- Frontend Client

### Terminal 1: Start Backend

```bash
node index.js
```

Backend will start and handle:

- Authentication
- Provider management
- Client management
- WireGuard configuration generation
- Tunnel tracking

---

### Terminal 2: Start Frontend

```bash
npm run dev
```

Frontend development server will start.

Open:

```text
http://localhost:3000
```

---

### Full Startup Workflow

```bash
# Terminal 1
node index.js

# Terminal 2
npm run dev
```

Once both services are running:

1. Open the frontend in your browser.
2. Register/Login.
3. Create or select a VPN provider.
4. Generate WireGuard configurations.
5. Establish a secure VPN tunnel.

---

## Example Generated Configuration

```ini
[Peer]
PublicKey = PROVIDER_PUBLIC_KEY

Endpoint = PROVIDER_IP:51820

AllowedIPs = 0.0.0.0/0

PersistentKeepalive = 25
```

This configuration allows the client to route traffic securely through the selected provider node. :contentReference[oaicite:3]{index=3}

---

## NAT Traversal

To simplify deployment:

- Providers must configure router port forwarding.
- WireGuard uses `PersistentKeepalive = 25`.
- Active handshakes keep NAT mappings alive.

This approach avoids the complexity of STUN, ICE, and hole-punching mechanisms while remaining practical for a marketplace MVP. :contentReference[oaicite:4]{index=4}

---

## Security

- WireGuard encryption
- Public/private key authentication
- Secure peer communication
- Protected API routes
- Tunnel verification

---

## Future Improvements

- STUN/TURN support
- NAT hole punching
- Cryptocurrency payments
- Escrow system
- Provider reputation scores
- Real-time analytics
- Multi-hop routing
- Docker deployment

---

## Disclaimer

Providers act as VPN exit nodes. Internet traffic from connected clients appears to originate from the provider's public IP address. Users should understand the legal and security implications before participating in the network. :contentReference[oaicite:5]{index=5}

---

## Contributors

- Abhiraj Mishra
- Himanshu Vishwakarma

---

## License

GNU GPL v3.0