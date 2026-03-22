// Test API connection from frontend context
const API_BASE_URL = 'http://127.0.0.1:5000/api';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    const url = `${API_BASE_URL}/analytics/dashboard`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('Failed to fetch:', response.statusText);
      return;
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    console.log('Success:', result.success);
    console.log('Data keys:', result.data ? Object.keys(result.data) : 'No data');
    console.log('Student analytics present:', !!result.data?.studentAnalytics);
    
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

// Run the test
testAPI();
