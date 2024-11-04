import http from 'k6/http';
import { sleep } from 'k6';
// to run need install k6
// choco install k6 
//for windows
//then run k6
//run with k6 cloud test.js

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m30s', target: 5 },
    { duration: '20s', target: 0 },
  ],
};



// Function to send a POST request to the first endpoint
function postToFirstEndpoint() {
  const url = 'https://example.com/api/endpoint1';  // Replace with your first URL
  const payload = JSON.stringify({
      key1: 'value1',
      key2: 'value2',
  });

  const headers = {
      'Content-Type': 'application/json',
  };

  let response = http.post(url, payload, { headers: headers });

  check(response, {
      'is status 200 for endpoint 1': (r) => r.status === 200,
  });
}

// Function to send a POST request to the second endpoint
function postToSecondEndpoint() {
  const url = 'https://example.com/api/endpoint2';  // Replace with your second URL
  const payload = JSON.stringify({
      keyA: 'valueA',
      keyB: 'valueB',
  });

  const headers = {
      'Content-Type': 'application/json',
  };

  let response = http.post(url, payload, { headers: headers });

  check(response, {
      'is status 200 for endpoint 2': (r) => r.status === 200,
  });
}

function getThirdEndpoint() {
  const url = http.get('https://httpbin.test.k6.io/');// replace with get endpoint
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
export default function () {
  postToFirstEndpoint();   // Call the function for the first endpoint
  postToSecondEndpoint();  // Call the function for the second endpoint
  getThirdEndpoint();
}

