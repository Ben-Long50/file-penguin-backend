<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Ben-Long50/file-penguin-backend.git">
    <img src="public/penguin_readme.svg" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">File Penguin API</h1>

  <p align="center">
    The backend API which powers the File Penguin web based file storage system
    <br />
    <a href="https://github.com/Ben-Long50/file-penguin-backend.git"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://file-penguin.netlify.app/">View Demo</a>
    ·
    <a href="https://github.com/Ben-Long50/file-penguin-backend/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Ben-Long50/file-penguin-backend/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#api-endpoints">API Endpoints</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Built With

<a href="https://nodejs.org">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" height="40" alt="Node.js">
</a>

<a href="https://expressjs.com">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" height="40" alt="Express">
</a>

<a href="https://www.postgresql.org">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" height="40" alt="PostgreSQL">
</a>

<a href="https://www.prisma.io">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" height="40" alt="Prisma">
</a>

### API Endpoints

#### Authentication Endpoints

| Method | Endpoint       | Description                                    |
| ------ | -------------- | ---------------------------------------------- |
| POST   | `/auth/signin` | Signs a user in locally an returns a jwt token |
| POST   | `/auth/signup` | Registers a new user locally                   |

#### Folder Endpoints

| Method | Endpoint                   | Description                                       |
| ------ | -------------------------- | ------------------------------------------------- |
| GET    | `/folders`                 | Fetches the current users folders                 |
| GET    | `/folders/:folderId`       | Fetches the contents of a specific folder         |
| POST   | `/folders`                 | Creates a new folder                              |
| POST   | `/folders/:folderId`       | Changes the name of a specific folder             |
| POST   | `/folders/:folderId/files` | Uploads up to 5 files to a specific folder        |
| PUT    | `/folders/:folderId`       | Changes the parent folder of a specific folder    |
| DELETE | `/folders/:folderId/trash` | Deletes all contents of the trash folder          |
| DELETE | `/folders/:folderId`       | Deletes a specific folder and all of its contents |

#### File Endpoints

| Method | Endpoint         | Description                                       |
| ------ | ---------------- | ------------------------------------------------- |
| GET    | `/files`         | Fetches the most recent posts of followed users   |
| GET    | `/files/:fileId` | Fetches the most recent posts of unfollowed users |
| POST   | `/files/:fileId` | Changes the name of a specific file               |
| PUT    | `/files/:fileId` | Changes the parent folder of a specific file      |
| DELETE | `/files/:fileId` | Deletes a specific file                           |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To access the live version of this project and explore all of it's features, use the official website link below. Otherwise, continue with the following instructions to run the project locally

<a href="https://file-penguin.netlify.app">
  <strong>File penguin »</strong>
</a>

### Prerequisites

1. To use the Pawprint API effectively, you will need to set up the GUI for local use. Please take a look at the instructions regarding the setup for the GUI in the following link:

   <a href="https://github.com/Ben-Long50/file-penguin-frontend.git"><strong>File Penguin frontend repo »</strong></a>

2. You will need to have psql installed locally

### Installation

1. **Clone the repository**

   Run the following command to clone the repository:

   ```sh
   git clone https://github.com/Ben-Long50/file-penguin-backend.git
   ```

2. **Navigate to the project directory and install dependencies**

   Move into the project directory and install the required npm packages:

   ```sh
   cd file-penguin-backend
   npm install
   ```

3. **Set up a local development database for the project**

   Open a second terminal and create a new database in psql. Connect to it:

   ```sh
   psql
   CREATE DATABASE <your_database_name>;
   \c <your_database_name>
   ```

   Return to the first terminal where you are located in the file-penguin-backend directory and migrate the database schema:

   ```sh
   npx prisma generate
   npx prisma migrate dev
   ```

   In the psql terminal, check that the schema has been successfully migrated over to the development db:

   ```sh
   \d
   ```

4. **Set up an account on Cloudinary**

   <a href="https://www.cloudinary.com/">
   <strong>Cloudinary »</strong>
   </a>

   Find the cloud name, api key and api secret associated with your account. They will be used as env variables in the next section

5. **Set up environment variables**

   Create a .env file in the project’s base directory and add the following environment variables:  
    (The JWT_SECRET can be anything you choose)

   ```js
   CLIENT_URL = 'http://localhost:5173';
   DATABASE_URL =
     'postgresql://<your_psql_username>:<your_psql_password>@localhost:5432/<your_database_name>';
   JWT_SECRET = '<your_jwt_secret>';
   CLOUD_NAME = '<your_cloudinary_cloud_name>';
   API_KEY = '<your_cloudinary_api_key>';
   API_SECRET = '<your_cloudinary_api_secret>';
   NODE_ENV = 'development';
   ```

6. **Avoid accidental pushes to the original repository**

   If you plan to make changes, update the Git remote to point to your own fork to prevent accidental pushes to the base repository:

   ```sh
   git remote set-url origin https://github.com/<your_github_username>/file-penguin-backend.git
   ```

   Confirm the change:

   ```sh
   git remote -v
   ```

   You should see:

   ```sh
   origin  https://github.com/<your_github_username>/file-penguin-backend.git (fetch)
   origin  https://github.com/<your_github_username>/file-penguin-backend.git (push)
   ```

7. **Start the Development Server**

   Run the following command to start the app:

   ```sh
   npm run serverstart
   ```

8. **Start the frontend dev server and access it in browser on port 5173**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Ben Long - [LinkedIn](https://www.linkedin.com/in/ben-long-4ba566129/)

Email - benjlong50@gmail.com

Project Link - [https://github.com/Ben-Long50/file-penguin-backend](https://github.com/Ben-Long50/file-penguin-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
