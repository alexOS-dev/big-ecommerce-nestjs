<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Installation

1. Install dependencies

```bash
pnpm install
```

2. Copy `.env.template` to `.env` and fill the variables

```bash
cp .env.template .env
```

3. Run the database

```bash
docker-compose up -d
```

4. Seed the database with initial data, open: `http://localhost:3000/api/seed`

5. Run the application

```bash
pnpm start:dev
```
