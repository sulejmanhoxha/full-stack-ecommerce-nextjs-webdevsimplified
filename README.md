# Nextjs Prisma Lucia boilerplate

This is a Nextjs 14 boilerplate with typescript, lucia for authentication, Shadcn/ui for the frontend and prisma for managing and querying the database.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First install the dependencies:
```bash
npm install
```

Then create a .env. Since in this project i am using SQLite i wrote this in it:
```env
DATABASE_URL="file:./db/dev.db"
```
If you want to use any other database, learn more about how to write the DATABASE_URL from [Prisma's documentation.](https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema)

After that run :
```sh
npm run migrate
```

If you want to view the database using a GUI, run this command and open [http://localhost:5555](http://localhost:5555) with your browser:
```sh
npm run studio
```

Lastly, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
