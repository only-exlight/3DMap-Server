/*let getImgFromArr = require('array-to-image').getDataUrlFromArr;
const data = new Uint8ClampedArray(256 * 256 * 4);
 
for(let i = 0; i < data.length; i += 4) {
  data[i] = 255; // r
  data[i + 1] = 0; // g
  data[i + 2] = 0; // b
  data[i + 3] = 255; // a
}
 
const img = getImgFromArr(data);
console.log(img);*/
/*
https://maps.googleapis.com/maps/api/elevation/json?locations=56.0,85.0&key=YOUR_API_KEY
https://maps.googleapis.com/maps/api/elevation/json?locations=56.0,85.0&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk
YOUR_API_KEY - AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk
*/
//Квадрат 500x500

let httpReq = (method, url) => {
  return new Promise((resolve, reject) => {
    if (method !== 'GET' && method !== 'POST') {
      reject('ERR: Unknown HTTP method')
    } else if (!url) {
      reject('ERR: Unknown URL')
    } else {
      let xhr = new XMLHttpRequest()
      xhr.open(method, url, true)
      xhr.send()
      xhr.onload = () => resolve(xhr.responseText)
      xhr.onerror = (err) => reject(err)
    }
  })
}
const a = [56.4737, 85.0288],
  b = [56.4737, 85.0293],
  c = [56.4742, 85.0293],
  d = [56.4742, 85.0288];

httpReq('GET', 'https://maps.googleapis.com/maps/api/elevation/json?locations=56.0,85.0&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk')
  .then(val => console.log(val))
  .catch(err => console.log(err))
  /*
for (let i = a[0]; i <= c[0]; i += .000001) {
  for (let j = a[1]; j <= d[1]; j += .000001) {
    console.log(i.toFixed(6), j.toFixed(6));
  }
}*/