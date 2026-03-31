# DESIGN.md

## 1. How did you ensure idempotency?

### Session creation
I ensured idempotency for `POST /sessions` by using a MongoDB upsert operation with `findOneAndUpdate(..., { upsert: true })` and `$setOnInsert`.

This guarantees that:
- if the `sessionId` does not exist, a new session is created
- if the same request is retried, the existing session is returned instead of creating a duplicate

I also added a **unique index** on `sessionId` so the database itself enforces uniqueness.

### Event creation
For `POST /sessions/:sessionId/events`, I ensured idempotency by making `eventId` unique **within a session**.

This is enforced through a MongoDB **compound unique index**:

```js
{ sessionId: 1, eventId: 1 }
The service first checks whether the event already exists for the given session.
If it exists, the existing event is returned.
If duplicate concurrent inserts happen, MongoDB prevents duplication through the unique index and the service gracefully returns the already-created event.

This ensures duplicate requests do not create duplicate events.

Session completion

For POST /sessions/:sessionId/complete, the operation is idempotent because:

if the session is already completed, the API simply returns the existing completed session
repeated completion requests do not create inconsistent state or modify the resource multiple times


2. How does your design behave under concurrent requests?
Concurrent session creation

Concurrent requests for the same sessionId are safe because:

sessionId is uniquely indexed
session creation uses MongoDB upsert

This ensures that even if multiple requests arrive at the same time, only one session document is created.

Concurrent event creation

Concurrent event creation is handled safely because:

the service first checks whether the event already exists
MongoDB enforces uniqueness using the compound unique index on (sessionId, eventId)
duplicate key conflicts are handled gracefully by returning the existing event

This makes the API safe against retries, duplicate submissions, and concurrent writes for the same event.

Concurrent session completion

If multiple requests try to complete the same session simultaneously, the final state remains correct.
The session transitions to completed, and repeated completion requests simply return the already-completed session.

This prevents race conditions from causing inconsistent session state.


3. What MongoDB indexes did you choose and why?

On conversation_sessions
{ sessionId: 1 }

Type: Unique index

Why:

guarantees one session per sessionId
supports idempotent session creation
makes session lookup efficient
On conversation_events
{ sessionId: 1, eventId: 1 }

Type: Compound unique index

Why:

guarantees event uniqueness within a session
prevents duplicate events from retries or concurrent requests
{ sessionId: 1, timestamp: 1 }

Type: Compound index

Why:

optimizes fetching events for a session ordered by timestamp
supports efficient pagination in GET /sessions/:sessionId



4. How would you scale this system for millions of sessions per day?

If the system needed to support millions of sessions per day, I would scale it in the following ways:

API scaling
deploy multiple stateless NestJS instances behind a load balancer
add rate limiting to protect against retry storms or abusive traffic
improve observability with structured logging, metrics, and tracing
Database scaling
shard MongoDB by sessionId
separate hot and cold data if retention becomes large
archive old completed sessions if long-term storage is required
Read scalability
switch from offset pagination to cursor-based pagination for very large event streams
optimize payload sizes if event payloads become significantly large
Reliability improvements

In a production-grade version, I would also consider:

asynchronous event ingestion
retry strategies
dead-letter handling
stronger operational monitoring

For this assignment, I intentionally kept the implementation simple, synchronous, and aligned with the stated constraints.



5. What did you intentionally keep out of scope, and why?

I intentionally kept the following out of scope:

authentication / authorization
background jobs / queues
retries / dead-letter workflows
audit logging
distributed tracing
schema versioning for payload evolution
soft delete / archival workflows
caching
rate limiting
Why?

The assignment explicitly prioritizes:

correctness
clarity
backend design
concurrency safety
idempotent behavior

Adding more infrastructure would increase complexity without directly improving the core assignment requirements.

Assumptions
sessionId is globally unique and externally provided
eventId is unique only within a session
events are immutable after creation
simple limit + offset pagination is sufficient for this assignment
existing sessions are returned as-is instead of being updated during repeated session creation requests

---

## 

Open:

```bash
DESIGN.md