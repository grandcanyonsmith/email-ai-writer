const fetch = require('node-fetch');

async function testAPI() {
  const baseURL = 'http://localhost:3001';
  
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test main endpoint
    console.log('\nTesting main endpoint...');
    const mainResponse = await fetch(baseURL);
    const mainData = await mainResponse.json();
    console.log('Main endpoint:', mainData);
    
    // Test sequences endpoint
    console.log('\nTesting sequences endpoint...');
    const sequencesResponse = await fetch(`${baseURL}/api/sequences`);
    const sequencesData = await sequencesResponse.json();
    console.log('Sequences:', sequencesData);
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI(); 