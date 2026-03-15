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
JWT_SECRETE=YOUR-JWT-SECRETE-SHOULD-BE-BIG
```

On the first local deploy, you should inicialite the database by command
```bash
npx drizzle-kit push
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

If you want to test in yout mobile, run:
```bash
npx next dev -H 0.0.0.0 
```
Need to check the ip of your device running the app to access by the mobile. Both mobile and service need to be in the same network (wifi).

At Linux service, run the command: `ifconfig` and search for word *inet*

Result example : 
```bash
wlp6s0: flags=0000<UP,BROADCAST,RUNNING,MULTICAST>  mtu 0000
        inet 192.199.1.176  netmask 255.255.255.0  broadcast 192.199.1.255

```

Open [http://localhost:3000](http://localhost:3000) with your destop browser to see the result.
Open [192.199.1.176:3000](192.199.1.176:3000) with your mobile browser to see the result. (_Following example for mobile_)

## Versions
- Node version 22.12.0
- Postgres version 15
- Client: Docker Engine version 29.2.1
- Server: Docker Engine version 29.2.1
