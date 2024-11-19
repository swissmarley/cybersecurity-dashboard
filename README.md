# <p align="center">🎯 Cybersecurity Dashboard 🎯</p>

A modern and feature-rich cybersecurity dashboard built using Node.js, Express, and JavaScript. This app provides useful cybersecurity tools including IP lookup, port scanning, vulnerability scanning, and malware analysis. It offers a clean and interactive interface for users to perform various security operations and retrieve valuable insights.

<img width="1324" alt="GUI" src="https://github.com/user-attachments/assets/84d752d1-cb85-4963-99e7-aa70625f3be2">


## Features

- **IP Lookup**: Lookup detailed information about an IP address using the IP-API service.
- **Port Scanning**: Scan ports for a given host using the ViewDNS API.
- **Vulnerability Scanning**: Scan for vulnerabilities using the VulDB API with a query for specific software vulnerabilities.
- **Malware Analysis**: Upload a file for analysis via Falcon Sandbox API, and retrieve detailed scan results.
- **Tool Usage Analytics**: Visualize the usage statistics of different tools with a dynamically updating bar chart.
- **Recent Activity**: View the latest activity logs for each tool, providing insights into recent scans and lookups.

## Table of Contents

- [Requirements](#requirements)
- [Environment](#environment)
- [Installation](#installation)
- [Docker](#docker)
- [Usage](#usage)
- [API Keys](#api-keys)
- [File Upload](#file-upload)
- [License](#license)
- [Contributing](#contributing)

## Requirements

This project requires the following software to be installed on your system:

- [Node.js](https://nodejs.org/) (>= 14.x)
- [npm](https://www.npmjs.com/) (Node package manager)

## Environment

Set up your variables in an environment:

1. Create .env file for your environment variables

    ```bash
    touch .env
    ```

2. Insert your API Keys inside the .env file

    ```bash
    VIEWDNS_API_KEY=YOUR_VIEWDNS_API_KEY
    VULDB_API_KEY=YOUR_VULDB_API_KEY
    FALCONSANDBOX_API_KEY=YOUR_FALCONSANDBOX_API_KEY
    ```


## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/cybersecurity-dashboard.git
   cd cybersecurity-dashboard
   ```

2. Install the required dependencies:

    ```bash
    npm start
    ```

3. Set up your [environment](#environment)


4. Start the server

    ```bash
    npm start
    ```

### Local Install with Docker

After you have cloned this repository and created the .env file with required API Keys, you can follow with these steps to build and run a Docker container.

1. Build Docker image

    ```bash
    docker build -t cybersecurity-dashboard .
    ```


2. Build and start the Docker container

    ```bash
    docker run -p 3000:3000 --env-file .env cybersecurity-dashboard
    ```

## Docker

1. Set up your [environment](#environment)

2. Run Docker Container

    ```bash
    docker run -p 3000:3000 --env-file .env ghcr.io/swissmarley/cybersecurity-dashboard:latest
    ```

<br>

## Usage

Once the server is running, open your browser and go to `http://localhost:3000`. 

The dashboard will display the following tools:

- IP Lookup: Enter an IP address to get detailed information.

- Port Scanning: Enter a domain to scan for open ports.

- Vulnerability Scanning: Enter a software name (e.g., 
"Microsoft Windows") to scan for known vulnerabilities.

- Malware Analysis: Upload a file to be analyzed for potential threats. You'll receive the result after processing.

### Malware Analysis Flow

- File Upload: Choose a file to upload.
- Analysis: The file is submitted for analysis via the Falcon Sandbox API.
- Result Fetching: After the file is processed, the result is retrieved via the sha256 hash, showing detailed analysis including whether the file is malicious, the behavior of the file, and other critical information.


## API Keys

This app requires several API keys to interact with external services. You will need to sign up for the following services and obtain your keys:

- [IP-API](http://ip-api.com/): For IP lookup.

- [ViewDNS](https://viewdns.info/api/): For port scanning.

- [VulDB](https://vuldb.com/): For vulnerability scanning.

- [Falcon-Sandbox](https://www.hybrid-analysis.com/docs/api/v2): For malware analysis.

## File Upload

Malware analysis involves uploading files to Falcon Sandbox for analysis. The file is temporarily stored on the server and sent to the Falcon Sandbox API. Once the analysis is complete, the file is deleted from the server.

### File Upload Guidelines:
- Supported file types: The app supports common file types for analysis (e.g., .exe, .dll, .pdf, etc.).

- File size limit: Ensure the file size is within Falcon Sandbox’s upload limits (usually 50MB or less).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository.

2. Create your feature branch `git checkout -b feature-branch`.

3. Commit your changes `git commit -am 'Add new feature'`

4. Push to the branch `git push origin feature-branch`

5. Open a pull request.
