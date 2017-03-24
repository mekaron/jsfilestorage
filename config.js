module.exports = {
  mounted: '/jsfs',
  chunksize: 1024 * 100,

  files: {}, // all files currently in the system and their relevant parts
  partstorage: {}, // all parts in the systems and their clients
  clients: {},
  partrequests: [], //
  proms: [],
  deferred_references: [],
  tempfile_index_reference: [],
};
