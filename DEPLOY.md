# Deploying Newcastle.dog to Docker / Unraid

## Prerequisites

- Docker 24+ and Docker Compose v2 (comes with Docker Desktop or `docker compose` plugin)
- For Unraid: **Compose Manager** plugin (by dcflachs) from Community Applications

---

## 1. Build & run locally with Docker Compose

### 1a. Create your environment file

Copy the example and fill in real values:

```bash
cp .env.example .env
```

`.env` contents (create this file):

```env
# Required — must be at least 32 random characters
SESSION_SECRET=change-me-to-a-long-random-secret-string-32chars

# Required — choose a strong password for the Postgres database
POSTGRES_PASSWORD=change-me-strong-db-password

# Optional — host port to expose the app on (default: 3000)
APP_PORT=3000
```

> **Never commit `.env` to version control.** It is already in `.gitignore`.

### 1b. Build and start

```bash
docker compose up --build -d
```

The first build takes ~3 minutes. Subsequent builds use the layer cache and are much faster.

### 1c. Seed the database (first run only)

```bash
docker compose exec app \
  node -e "
    const { execSync } = require('child_process');
    execSync('cd /app/artifacts/newcastle-dog && npx prisma db seed', { stdio: 'inherit' });
  "
```

Or run the seed script directly:

```bash
docker compose exec app \
  sh -c 'DATABASE_URL=$DATABASE_URL npx tsx /app/artifacts/newcastle-dog/prisma/seed.ts'
```

### 1d. Access the app

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public site |
| `http://localhost:3000/admin` | Admin back office |

Default admin credentials (change immediately after first login):
- **Email:** `admin@newcastle.dog`
- **Password:** `admin123`

---

## 2. Deploying on Unraid

### 2a. Install Compose Manager

1. Open Unraid web UI → **Apps** (Community Applications)
2. Search for **Compose Manager** and install it
3. After install, a **Compose** tab appears in the top nav

### 2b. Upload the project

Transfer this repository to your Unraid server. Common paths:

```
/mnt/user/appdata/newcastle-dog/
```

Using SCP:

```bash
scp -r . root@<unraid-ip>:/mnt/user/appdata/newcastle-dog/
```

Or use the Unraid terminal (`ssh root@<unraid-ip>`) and `git clone`.

### 2c. Create the environment file on Unraid

```bash
cd /mnt/user/appdata/newcastle-dog
cat > .env << 'EOF'
SESSION_SECRET=replace-with-32+-random-chars
POSTGRES_PASSWORD=replace-with-strong-password
APP_PORT=3000
EOF
```

Generate a strong `SESSION_SECRET`:

```bash
openssl rand -hex 32
```

### 2d. Add the compose stack in Compose Manager

1. Unraid UI → **Compose** tab → **Add New Stack**
2. **Name:** `newcastle-dog`
3. **Compose file path:** `/mnt/user/appdata/newcastle-dog/docker-compose.yml`
4. Click **Save**, then **Start**

Alternatively, start from the Unraid terminal:

```bash
cd /mnt/user/appdata/newcastle-dog
docker compose up --build -d
```

### 2e. Seed the database (first run only)

```bash
docker compose -f /mnt/user/appdata/newcastle-dog/docker-compose.yml exec app \
  sh -c 'npx tsx /app/artifacts/newcastle-dog/prisma/seed.ts'
```

### 2f. Persistent data

Postgres data is stored in the Docker volume `newcastle-dog_postgres_data`.  
On Unraid, Docker volumes live at `/var/lib/docker/volumes/` by default.

To persist on a specific share instead, edit `docker-compose.yml`:

```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/user/appdata/newcastle-dog/db-data
```

Then create the directory first: `mkdir -p /mnt/user/appdata/newcastle-dog/db-data`

---

## 3. Reverse proxy (optional but recommended)

To serve on port 80/443 with a domain name, place Nginx Proxy Manager or Traefik in front.

### Unraid + Nginx Proxy Manager

1. Install **Nginx Proxy Manager** from Community Applications
2. Add a Proxy Host:
   - **Domain:** `newcastle.dog` (or your local domain)
   - **Forward Hostname/IP:** `newcastle-dog-app` (the container name)
   - **Forward Port:** `3000`
   - Enable **Block Common Exploits** and **Websockets Support**

---

## 4. Updating

```bash
cd /mnt/user/appdata/newcastle-dog

# Pull latest code
git pull

# Rebuild and restart (migrations run automatically on startup)
docker compose up --build -d
```

---

## 5. Useful commands

| Command | Description |
|---------|-------------|
| `docker compose logs -f app` | Stream app logs |
| `docker compose logs -f postgres` | Stream DB logs |
| `docker compose down` | Stop all containers |
| `docker compose down -v` | Stop and delete the DB volume |
| `docker compose exec app sh` | Shell into the app container |
| `docker compose exec postgres psql -U newcastle_dog -d newcastle_dog` | Postgres shell |

---

## 6. Backup & restore

### Backup the database

```bash
docker compose exec postgres \
  pg_dump -U newcastle_dog newcastle_dog > backup-$(date +%Y%m%d).sql
```

### Restore from backup

```bash
docker compose exec -T postgres \
  psql -U newcastle_dog -d newcastle_dog < backup-YYYYMMDD.sql
```
