This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
Install the packages:
```bash
npm install
```

Install Docker and an image of Postgres. Current using Postgres version 15.
```bash
docker pull postgres:15
```

Set the container
```bash
docker run -d --name NAME-OF-CONTAINER -e POSTGRES_DB=librarie_db -e POSTGRES_USER=YOUR-USER -e POSTGRES_PASSWORD=YOUR-PASSWORD -p 5435:5432 postgres:15
```

Set the environment variables to connect with the database in the .env file.
```basg
DATABASE_URL=postgres://YOUR-NAME:YOUR-PASSWORD@localhost:5435/librarie_db
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Versions
Node version 22.12.0
Postgres version 15
Client: Docker Engine version 29.2.1
Server: Docker Engine version 29.2.1