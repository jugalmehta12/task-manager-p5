# Practical 9: In-Memory Caching and Query Optimization

## Implementation

`backend/cache.js` owns one `node-cache` instance with a 60-second TTL. `GET /api/tasks` checks the fixed `all_tasks` key before querying MongoDB. A cache miss queries MongoDB and stores the response; a cache hit returns the stored response immediately.

The optional `GET /api/tasks/:id` endpoint is cached separately with `task:<id>`. Every successful `POST`, `PUT`, or `DELETE` invalidates both the collection and item keys, preventing stale task data from being served after a write.

`GET /api/tasks/debug/cache` is a protected diagnostic endpoint that reports hit, miss, and invalidation counters. It is for lab verification only.

## Measurement procedure

1. Log in and copy the JWT.
2. Call `GET /api/tasks` three times with the same bearer token. The first response includes `"cache":"MISS"`; the next two include `"cache":"HIT"`.
3. Record Postman's **Time** field in the table below.
4. Create, update, or delete a task, then call `GET /api/tasks` again. It must report `MISS`, proving invalidation works.
5. To collect uncached readings, restart the API before each call or temporarily set `stdTTL: 0`; restore `stdTTL: 60` after the experiment.

## Lab journal table

| Reading | Uncached GET /tasks (ms) | Cached GET /tasks (ms) |
|---|---:|---:|
| 1 | Record in Postman | Record in Postman |
| 2 | Record in Postman | Record in Postman |
| 3 | Record in Postman | Record in Postman |

Actual values depend on the local MongoDB data, machine load, and network. They should be recorded during the student's own run rather than invented in the report.

## Limitation

`node-cache` is process-local. Restarting the API clears it, and multiple API instances would each have different cache contents. A shared store such as Redis is required for multi-server deployment.
