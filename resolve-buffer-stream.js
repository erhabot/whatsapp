module.exports = (stream) => {
  return new Promise((resolve, reject) => {
    let buff = Buffer.alloc(0);
    
    stream.on('data', (chunk) => {
      buff = Buffer.concat([buff, chunk]);
    });
    
    stream.on('end', () => {
      resolve(buff);
    });
    
    stream.on('error', (error) => {
      reject(error);
    });
  });
};