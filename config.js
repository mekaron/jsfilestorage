module.exports = {
  mounted: '/jsfs',
  websocketpath: 'ws://localhost:8080',
  chunksize: 1024 * 100,
  retrievingFile: false,

  files: {}, // all files currently in the system and their relevant parts
  partstorage: {}, // all parts in the systems and their clients
  clients: {},
  partrequests: [],
  requestPromises: [],
  requestPromisesDefer: [],
  requestedFileParts: [],
};
