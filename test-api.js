// Simple test script to verify Portfolio Personal API connection
const axios = require('axios');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testAPI() {
  console.log('🔍 Testing Portfolio Personal API connection...\n');
  
  // Check if environment variables are loaded
  const authorizedClient = process.env.PORTFOLIO_PERSONAL_AUTHORIZED_CLIENT;
  const clientKey = process.env.PORTFOLIO_PERSONAL_CLIENT_KEY;
  const apiKey = process.env.PORTFOLIO_PERSONAL_API_KEY;
  const apiSecret = process.env.PORTFOLIO_PERSONAL_API_SECRET;
  const baseURL = process.env.PORTFOLIO_PERSONAL_API_URL || 'https://clientapi_sandbox.portfoliopersonal.com/';
  
 
  console.log('📋 Environment Variables:');
  console.log(`  AuthorizedClient: ${authorizedClient ? '✅ Set' : '❌ Missing'}`);
  console.log(`  ClientKey: ${clientKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`  ApiKey: ${apiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`  ApiSecret: ${apiSecret ? '✅ Set' : '❌ Missing'}`);
  console.log(`  BaseURL: ${baseURL}\n`);
  
  if (!authorizedClient || !clientKey || !apiKey || !apiSecret) {
    console.log('❌ Missing required environment variables!');
    console.log('Please check your .env.local file and ensure all credentials are set.');
    return;
  }
  
  // Create axios client
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'AuthorizedClient': authorizedClient,
      'ClientKey': clientKey,
      'ApiKey': apiKey,
      'ApiSecret': apiSecret,
    },
  });
  
  // Test different endpoints
  const endpoints = [
    '/api/v1/MarketData/GetSymbols',
    '/api/MarketData/GetSymbols',
    '/MarketData/GetSymbols',
    '/api/v1/symbols',
    '/api/symbols',
    '/symbols',
    '/',
    '/health',
    '/status'
  ];
  
  console.log('🌐 Testing different base URLs and endpoints...\n');
  
  for (const testURL of alternativeURLs) {
    console.log(`\n🔗 Testing base URL: ${testURL}`);
    
    const testClient = axios.create({
      baseURL: testURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'AuthorizedClient': authorizedClient,
        'ClientKey': clientKey,
        'ApiKey': apiKey,
        'ApiSecret': apiSecret,
      },
    });
    
    // Test a few key endpoints for each URL
    const keyEndpoints = ['/', '/api', '/api/v1', '/health', '/status'];
    
    for (const endpoint of keyEndpoints) {
      try {
        const response = await testClient.get(endpoint);
        console.log(`  ✅ SUCCESS: ${endpoint} - ${response.status} ${response.statusText}`);
        if (response.data) {
          console.log(`  📄 Response preview: ${JSON.stringify(response.data).substring(0, 100)}...`);
        }
        break; // If we get a success, this URL might be correct
      } catch (error) {
        if (error.response) {
          console.log(`  ❌ ${endpoint}: ${error.response.status} ${error.response.statusText}`);
        } else {
          console.log(`  ❌ ${endpoint}: ${error.message}`);
        }
      }
    }
  }
}

testAPI().catch(console.error);
