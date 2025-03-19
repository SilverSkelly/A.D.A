# A.D.A: AI Debugging Assistant

Welcome to A.D.A, your AI Debugging Assistant designed to streamline the debugging process using advanced artificial intelligence techniques.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Future Plans](#future-plans)
## Overview

A.D.A is an AI-powered debugging tool that assists developers in identifying, learning and resolving code issues more efficiently. By leveraging machine learning models, A.D.A analyzes code snippets, detects syntax and logical errors, and provides intelligent suggestions for fixes. This tool aims to reduce the time spent on debugging and help beginners learn coding, especially in UE5 .

## Features

- **Error Detection**: Identifies syntax and logical errors in code.
- **Multi-Language Support**: Compatible with multiple programming languages.
- **User-Friendly Interface**: Intuitive UI for easy interaction.
- **Performance Analysis**: Evaluates code performance and suggests optimizations.
- **Detailed Explanations**: Provides detailed explanations on code or questions.

## Technology Stack

- **Frontend**: HTML, CSS, Vite, React.js, Tailwind, Flowbite
- **Backend**: Node.js, Express.js, Mjs
- **Machine Learning**: Integration with deepseek's coder-1.3b instruct LLM model
- **Database**: MongoDB

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SilverSkelly/A.D.A.git
   ```
2. **Navigate to the Project Directories**:
   ```bash
   cd backend
   ```
   ```bash
   cd frontend
   ```
   
3. **Install Dependencies**:
   
   backend-
   ```bash
   npm install
   ```
   frontend-
   ```bash
   npm inst vite
   ```
   
5. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```
6. **Start the Application**:
   backend-
   ```bash
   npm start
   ```
   frontend-
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## Usage

1. **Access the Web Interface**:
   - Open your browser and navigate to `http://localhost:8080`.
2. **Submit Code for Analysis**:
   - Paste your code snippet into the provided text area.
   - Select the programming language.
   - Click "Analyze" to initiate the debugging process.
3. **Review Suggestions**:
   - A.D.A will display detected issues and provide suggestions for fixes.
   - Apply the recommended changes to your code as needed.

## Troubleshooting

- **Issue**: Application not starting.
  - **Solution**: Ensure all dependencies are installed and the OpenAI API key is correctly set in the `.env` file.
- **Issue**: AI Failed to fetch.
  - **Solution**: Verify that the code snippet is less than 4096 tokens.

## Future Plans
- **Extend Tokens**: Alow for more than 4096 tokens to be submited at one time.
- **Upload file Integration**: Develop and implement a upload file for csv and json files.
- **Update UI**: Update UI for more clarity in user experience.
- **Enhanced Engine Support**: Extend compatibility to more game engines(e.g. unity and godot).
