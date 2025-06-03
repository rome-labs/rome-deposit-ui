# Rome SOL/rSOL deposit UI

## Environment Setup & Docker Guide

### 1. Environment Variables

First, create a `.env` file in the root directory (`rome-deposit-ui/.env`):

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL = "https://api.devnet.solana.com/"
NEXT_PUBLIC_ROLLUP_PROGRAM = "RTMvcqiZSbm57DaDewt8H4FShWFJBTQscfKLAT4PfDa"
```

### 2. Setup L2 chains

Copy chains-template.yaml and modify contents to chains.yaml

```env
- name: "FooSol"
  chainId: "100001"
  rpcUrl: "https://foosol.devnet.romeprotocol.xyz"
  explorerUrl: "https://foosol.devnet.romeprotocol.xyz:1000"
  contracts:
    uniswapV2Factory: "0x54C4C8eFe05EA40c0de1ef2608aDf32A3C2e019c"
    uniswapV2Router: "0x44c256191409A855b66f609676818b537Fd0b86e"
    weth: "0x33932D72AA77E1De7cB173bB88C46080c731Dd39"
    multicall: "0x54C4C8eFe05EA40c0de1ef2608aDf32A3C2e019c"
```

### 3. Development Setup

```bash
# Fix permissions if needed
sudo chown -R $USER:$USER .
rm -rf .next

# Install dependencies
yarn install

# Run development server
yarn dev
```

The app will be available at:

- Local: http://localhost:3000
- Network: http://your-ip:3000

### 4. Docker Build & Run

There are three ways to run the Docker container with environment variables:

1. Using volume mount (Recommended):

```bash
# Build the image
docker build -t rome-deposit-ui .
```

2. Using environment file:

```bash
# Run with .env file
docker run -d \
  --name rome-deposit-ui \
  --env-file ./.env \
  -p 3000:3000 \
  rome-deposit-ui
```

3. Using docker-compose (Recommended for development):

```yaml
# docker-compose.yml
version: "3.8"
services:
  rome-deposit-ui:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./.env:/app/.env
    environment:
      - NODE_ENV=production
```

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Verify Environment Variables

After starting the container, verify the environment variables:

```bash
# Check if .env file is mounted
docker exec rome-deposit-ui cat /app/.env

# Verify environment variables in container
docker exec rome-deposit-ui env | grep NEXT_PUBLIC

# Check container logs
docker logs rome-deposit-ui
```

Expected output should show:

```
NEXT_PUBLIC_L2_RPC_URL = "https://foosol.devnet.romeprotocol.xyz"
...
```

### 5. Troubleshooting

Environment Variable Issues:

```bash
# If environment variables are not loading:
1. Check .env file exists:
ls -la .env

2. Verify .env file content:
cat .env

3. Check container mounting:
docker inspect rome-deposit-ui | grep -A 10 Mounts

4. Try rebuilding without cache:
docker-compose build --no-cache
```

Permission Issues:

```bash
# If you see EACCES errors:
sudo chown -R $USER:$USER .
rm -rf .next
yarn install
yarn dev
```
