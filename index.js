
export const http = {
  logger: [],
  lastCall: {},
  fetchOptions: {
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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

  setOptions: function (options) {
    this.fetchOptions = { ...this.fetchOptions, ...options }
  },


  get: async function (url, data) {
    return await this.ajax(url, this.get.name.toUpperCase(), data)
  },
  post: async function (url, data) {
    return await this.ajax(url, this.post.name.toUpperCase(), data)
  },
  put: async function (url, data) {
    await this.ajax(url, this.put.name.toUpperCase(), data)

  },
  delete: async function (url, data) {
    await this.ajax(url, this.delete.name.toUpperCase(), data)

  },
  patch: async function (url, data) {
    await this.ajax(url, this.patch.name.toUpperCase(), data)

  },
  beacon: function (url, data) {
    return new Promise((resolve, reject) => {
      if (!'navigator' in window) throw new Error('navigator is not defined in window')
      try {
        resolve(navigator.sendBeacon(url, data))
      } catch (error) {
        reject(error)
      }
    })
  },

  connect: async function (url) { },

  onFail: function (err) {
    throw err
  },

  trace: function (url, data) {
    const { userAgentData } = navigator
    const log = this._createLog(url, data, userAgentData)
    this.logger.push(log)
  },

  getLogs: function () {
    return this.logger
  },

  _createLog: function (url, data, userAgentData) {
    return {
      id: Math.random().toString(36).substring(2),
      url,
      data,
      timestamp: Date.now(),
      userAgentData,
      protocol: window.protocol
    }
  },

  ajax: async function (url, method, data) {
    this.lastCall = {
      url,
      method,
      data
    }

    if (method === 'GET' && data) {
      const queryString = new URLSearchParams(data).toString();
      url = `${url}/?${queryString}`
    }

    this.trace(url, data)
    try {
      const fetchOptions = { ...this.fetchOptions, method }
      if (method !== 'GET') {
        fetchOptions.body = this._getBodyByContentType(data)
      }
      const res = await fetch(url, fetchOptions)
      return this._getResByContentType(res)
    } catch (error) {
      console.error(error)
      const errorMsg = this.createErrorMsg(error)
      this.onFail(errorMsg)
    }

  },

  _getResByContentType(res) {
    if (this.fetchOptions.headers["Content-Type"] === "application/json") {
      return res.json()
    }
    if (this.fetchOptions.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      return res.text()
    }
    if (this.fetchOptions.headers["Content-Type"] === "multipart/form-data") {
      return res.formData()
    }
  },

  _getBodyByContentType: function () {
    if (this.fetchOptions.headers["Content-Type"] === "application/json") {
      return JSON.stringify(data)
    }
    if (this.fetchOptions.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      return new URLSearchParams(data).toString()
    }
    if (this.fetchOptions.headers["Content-Type"] === "multipart/form-data") {
      return data
    }
  },

  createErrorMsg: function (error) {
    return {
      desc: '[Failed to fetch data]' + error.message,
      stack: error.stack,

    }

  }
}

