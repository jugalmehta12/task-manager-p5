const NodeCache = require('node-cache');

// Process-local cache used by Practical 9. A 60-second TTL keeps repeat reads
// fast while still limiting how long data can remain in memory.
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const stats = { hits: 0, misses: 0, invalidations: 0 };

function get(key) {
  const value = cache.get(key);
  if (value === undefined) {
    stats.misses += 1;
    return undefined;
  }
  stats.hits += 1;
  return value;
}

function set(key, value) {
  cache.set(key, value);
}

function invalidateTasks() {
  cache.keys()
    .filter((key) => key === 'all_tasks' || key.startsWith('task:'))
    .forEach((key) => cache.del(key));
  stats.invalidations += 1;
}

function snapshot() {
  return { ...stats, keys: cache.keys(), ttlSeconds: 60 };
}

module.exports = { get, set, invalidateTasks, snapshot };
