const https = require('https');

const url = 'https://res.cloudinary.com/dmpy1yv4c/image/upload/v1774353640/Logo_TV_3D_ulxx6x.png';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Body:', data.slice(0, 1000));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
