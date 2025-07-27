const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function uploadFile() {
  try {
    // Path to the test document
    const filePath = path.join(__dirname, '..', 'public', 'test-document.txt');
    
    // Create a form data object
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('type', 'code');
    
    // Upload the file
    console.log('Uploading file...');
    const response = await fetch('http://localhost:3002/api/upload', {
      method: 'POST',
      body: form
    });
    
    // Check response status
    console.log('Status:', response.status);
    
    // Get response text first
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    // Try to parse as JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.log('Not valid JSON response');
    }
    
    // No need to log again as we've already logged above
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// Run the upload function
uploadFile();