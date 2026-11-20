# V3 CONCURRENCY TEST RESULTS

### Concurrency Test Matrix & Live Evidence

| Test ID | Test Scenario | Concurrency Challenge | Expected Behavior | Actual Observed Outcome | Status |
|---|---|---|---|---|---|
| **TC_V3_001** | Two-node simultaneous OTP dispatch | Two instances simultaneously call `acquireReservation` for same email/purpose | Exactly one acquires lease; second node rejected | **Node A acquired lease; Node B received inFlight rejection** | **PASS** |
| **TC_V3_002** | Late dispatch after lease expiry | Node A finishes SMTP 35s later after Node B already acquired a new reservation | Node A's late update affects 0 rows; Node B's state unaffected | **Node B acquired lease; Node A late activation affected 0 rows** | **PASS** |
| **TC_V3_003** | Old reservation overwrite prevention | Node A attempts to write OTP hash after losing token ownership | Conditional update strictly guards by `DispatchToken` | **0 rows affected; current token preserved** | **PASS** |
| **TC_V3_004** | Process crash & lease recovery | Node A crashes during `RESERVED` state, leaving lease expired | Node B safely takes over lease without deadlock | **Expired lease recovered by Node B in 24ms** | **PASS** |
| **TC_V3_005** | Failure rollback on provider error | SMTP rejected due to invalid envelope | State set to FAILED; cooldown cleared | **Immediate retry succeeded without 60s cooldown lockout** | **PASS** |
| **TC_V3_006** | Ambiguous delivery timeout | Provider connection hangs / times out | State remains FAILED; unconfirmed OTP not verifiable | **Unconfirmed code rejected during verification** | **PASS** |
| **TC_V3_015** | Simultaneous OTP replay attack | Two clients submit the same valid OTP at the exact same millisecond | Exactly one client consumes OTP; second client rejected | **Client 1 verified; Client 2 rejected with "already consumed"** | **PASS** |
| **TC_V3_019** | Token ownership enforcement | Attacker attempts to activate reservation using fabricated token | SQL conditional update strictly rejects invalid token | **Fake token 0 rows; legitimate token 1 row** | **PASS** |

---

### Concurrency Evidence Trace

```text
[TC_V3_001 Execution Log]
>> Request A & Request B fired concurrently to WatchHubDB (127.0.0.1:1433)
>> Node A executed acquireReservation -> acquired: true, token: f4d8170c-39a1-4ee2...
>> Node B executed acquireReservation -> UNIQUE constraint collision -> caught & re-evaluated -> acquired: false (inFlight: true)
Result: Exactly one reservation acquired. Zero duplicate emails generated.

[TC_V3_015 Replay Attack Log]
>> Verifying OTP '654321' simultaneously via Worker A and Worker B
>> Worker A executed atomic conditional UPDATE -> 1 row affected -> Session token issued
>> Worker B executed atomic conditional UPDATE -> 0 rows affected -> 'This verification code was already consumed'
Result: Zero session duplication. Single-use consumption guaranteed.
```
