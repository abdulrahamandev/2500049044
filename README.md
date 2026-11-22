# Student Records

A simple sample app for managing student records. It uses Express, Mongoose, and MongoDB Atlas.

## Run it

1. Install Node.js.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add your MongoDB Atlas connection string as `MONGODB_URI`.
4. Run `npm start`.
5. Open <http://localhost:3000>.

In MongoDB Atlas, create a database user and allow your machine's IP address in Network Access.
If your connection file has a different name, set `DOTENV_CONFIG_PATH` to that file before running the start command. For example, in PowerShell: `$env:DOTENV_CONFIG_PATH = "atlas-credentials.env"`.

The app supports adding, viewing, searching by roll number or department, updating, and deleting students.
