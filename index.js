

export const http = {

 lastCall: {},
 headers: {
  "Content-Type": "application/json",
 },
 retry: function (tries, delay) {
  if (!tries || !delay) throw 'Calling retry method requires tries and delay as arguments'

  return new Promise((res, rej) => {
   setTimeout(() => {
    if (tries > 0) {
     tries--
     // activate last call retry
     const { url, method, data } = this.lastCall
     this.ajax(url, method, data)
      .then(res)
      .catch(rej)
    }
   }, delay)
  })
 },
 setHeaders: function (headers) {
  this.headers = headers
 },
 get: async function (url, data) {
  return await this.ajax(url, this.get.name.toUpperCase(), data)
 },
 post: async function (url, data) {
  return await this.ajax(url, this.get.name.toUpperCase(), data)
 },
 put: async function (url, data) {
  await this.ajax(url, this.get.name.toUpperCase(), data)

 },
 delete: async function (url, data) {
  await this.ajax(url, this.get.name.toUpperCase(), data)

 },
 patch: async function (url, data) {
  await this.ajax(url, this.get.name.toUpperCase(), data)

 },
 beacon: function (url, data) {
  return new Promise((resolve, reject) => {
   try {
    return resolve(navigator.sendBeacon(url, data))
   } catch (error) {
    reject(error)
   }
  })
 },
 trace: async function (url, data) { },
 connect: async function (url) { },

 onFail: function (err) {
  throw err
 },

 ajax: async function (url, method, data) {
  debugger
  this.lastCall = {
   url,
   method,
   data
  }

  if (method === 'GET' && data) {
   const queryString = new URLSearchParams(data).toString();
   url = `${url}/?${queryString}`
  }
  try {
   const res = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: this.headers,
    body: method === 'GET' ? null : JSON.stringify(data), // body data type must match "Content-Type" header
   })
   return res.json()
  } catch (error) {
   console.error(error)
   const errorMsg = this.createErrorMsg(error)
   this.onFail(errorMsg)
  }

 },

 createErrorMsg: function (error) {
  return {
   desc: 'Failed to fetch data',
   stack: error.stack,

  }

 }
}

