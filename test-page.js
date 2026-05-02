const fetch = require('node:http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/demand',
  method: 'GET',
  headers: {
    'Accept': 'text/html'
  }
};

const req = fetch.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (data.includes('module') && data.includes('index')) {
      console.log('✓ SPA 页面正确返回');
    } else {
      console.log('✗ 页面可能有问题');
      console.log(data.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('错误:', e.message));
req.end();
