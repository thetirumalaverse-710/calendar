# UML 5 — Sequence Diagrams

## Overview

This document specifies the interaction sequences of **The Tirumala Verse** application across three core operational workflows:
1. **Public User / Application Data Flow**: Client-side asset rendering, Supabase data fetching, LocalStorage privacy isolation, and Web Push subscription registration.
2. **Telegram Token Ingestion Sequence**: Automated 10-minute MTProto polling, regex message parsing, and database persistence.
3. **Admin Web Push Notification Dispatch Sequence**: Outbox notification creation, atomic RPC claiming, VAPID cryptographic signing, push delivery, dead subscription cleanup, and Service Worker notification handling.

---

## 1. Public User / Application Data Flow

This diagram models the execution sequence when a public devotee accesses the application, reads temple events and token data, submits community feedback, and opts into Web Push notifications.

```mermaid
sequenceDiagram
    autonumber
    actor Devotee as Devotee / Public User
    participant Browser as Web Browser
    participant SPA as React/Vite SPA (App.jsx)
    participant LocalStorage as Browser LocalStorage
    participant SW as Service Worker (public/sw.js)
    participant Supa_Client as Supabase Client (anon key)
    participant Supa_DB as Supabase PostgreSQL DB
    participant Supa_Storage as Supabase Storage (event-photos)

    %% Page Load & Data Fetching
    Devotee->>Browser: Open https://thetirumalaverse.in/
    Browser->>SPA: Execute React Application Bundle
    SPA->>Supa_Client: Query Events & Glossary Data
    Supa_Client->>Supa_DB: SELECT * FROM events & glossary (Public RLS)
    Supa_DB-->>Supa_Client: Return Festival Events & Glossary Records
    Supa_Client-->>SPA: Update React Events/Glossary State
    SPA->>Supa_Storage: Request Event Banner & Gallery Images
    Supa_Storage-->>SPA: Return Image Assets
    SPA-->>Browser: Render Calendar Grid & Event Detail Modals

    %% Community Feedback Submission (LocalStorage Isolation)
    Note over Devotee,LocalStorage: Community Feedback (Local Privacy Boundary)
    Devotee->>SPA: Submit Feedback Form (Title, Description, CAPTCHA, Screenshot)
    SPA->>LocalStorage: Save Submission to 'tirumala_feedback_submissions'
    LocalStorage-->>SPA: Confirm Local Storage Update
    SPA-->>Devotee: Display Success Confirmation Toast

    %% Web Push Subscription Setup
    Note over Devotee,Supa_DB: Web Push Subscription Registration
    Devotee->>SPA: Click Enable Notifications Toggle in Header
    SPA->>Browser: Notification.requestPermission()
    Browser-->>SPA: Permission Granted
    SPA->>Browser: navigator.serviceWorker.register('/sw.js')
    Browser->>SW: Register & Activate Service Worker
    SPA->>Browser: pushManager.subscribe({ userVisibleOnly, applicationServerKey })
    Browser-->>SPA: Return PushSubscription Object (endpoint, p256dh, auth)
    SPA->>Supa_Client: rpc('register_push_subscription', { endpoint, p256dh, auth })
    Supa_Client->>Supa_DB: Execute register_push_subscription (Security Definer)
    Supa_DB->>Supa_DB: Upsert record into push_subscriptions (is_active = true)
    Supa_DB-->>Supa_Client: Return Subscription UUID
    Supa_Client-->>SPA: Confirm Registration Success
    SPA-->>Devotee: Display 'Background Alerts Enabled' Toast
```

### Flow Explanation
1. **Public Read Query**: The client browser loads the SPA, which executes read-only SELECT queries for events, glossary items, and token days via `supabaseClient.js`.
2. **Media Fetching**: High-resolution festival photos are fetched directly from the public `event-photos` Supabase storage bucket.
3. **Local Feedback Storage**: Community feedback submissions are validated with a CAPTCHA and persisted exclusively inside client `LocalStorage`. No network requests are transmitted to backend servers.
4. **Push Subscription RPC**: Web Push subscription requests generate a browser `PushSubscription` object and invoke the `register_push_subscription` RPC. The Security Definer function inserts or reactivates the endpoint in `push_subscriptions` while bypassing direct client table access restrictions.

---

## 2. Telegram Token Ingestion Sequence

This diagram models the automated backend ingestion pipeline where GitHub Actions periodically polls Telegram for live Tirupati SSD/DD token updates and persists structured observations into Supabase PostgreSQL.

```mermaid
sequenceDiagram
    autonumber
    participant GHA as GitHub Actions Runner (Cron 10m)
    participant Poll_Script as telegram-poll.mjs (Node 22)
    participant Telegram as Telegram API (LaxmiTeluguTechChannel)
    participant Parser as telegramTokenParser.js
    participant Supa_DB as Supabase PostgreSQL DB (Service Role)
    actor Devotee as Devotee / Public User
    participant Token_UI as Frontend Token UI (SSDTokens.jsx)

    %% Ingestion Execution
    GHA->>Poll_Script: Trigger scheduled execution (npm run telegram-poll)
    Poll_Script->>Telegram: Connect via teleproto MTProto Client (TELEGRAM_SESSION)
    Telegram-->>Poll_Script: Return recent 500 Channel Messages
    Poll_Script->>Poll_Script: Filter messages for today's India Date (Asia/Kolkata)
    
    loop For Each Today Message
        Poll_Script->>Parser: parseTelegramTokenMessage(messageText)
        Parser-->>Poll_Script: Return Parsed Token Object (SSD/DD counts, timings, status)
        
        alt Issue Start or Timing Message Discovered
            Poll_Script->>Supa_DB: Upsert token_days (issuance_date, timings, status)
            Supa_DB-->>Poll_Script: Confirm token_days Record Saved
        end

        alt Token Count Snapshot Observation
            Poll_Script->>Supa_DB: INSERT INTO token_observations (token_day_id, observed_at, counts, source_ref)
            alt Insert Success
                Supa_DB-->>Poll_Script: Observation Row Created
            else Duplicate Source Reference (HTTP 23505)
                Supa_DB-->>Poll_Script: Duplicate Rejected by UNIQUE Constraint
            end
        end
    end

    Poll_Script->>Telegram: Disconnect MTProto Session
    Poll_Script-->>GHA: Execution Complete (Inserted, Duplicates, Log Summary)

    %% Frontend Reading Flow (Decoupled)
    Note over Devotee,Supa_DB: Frontend Display (Decoupled Read Flow)
    Devotee->>Token_UI: Open SSD/DD Tokens Tab (/tokens)
    Token_UI->>Supa_DB: getTodayTokenData() (SELECT FROM token_days & token_observations)
    Supa_DB-->>Token_UI: Return Today's Token Day & Observation Time-Series
    Token_UI-->>Devotee: Render Live Status, Timelines & 7-Day History
```

### Flow Explanation
1. **Scheduled Polling**: Every 10 minutes, GitHub Actions triggers `telegram-poll.mjs`.
2. **MTProto API Retrieval**: The script authenticates with Telegram using `TELEGRAM_SESSION` and fetches recent messages from `LaxmiTeluguTechChannel`.
3. **Structured Regex Parsing**: `telegramTokenParser.js` parses remaining token counts, start times, completion times, and status flags.
4. **Database Persistence**: Upserts daily token state into `token_days` and appends time-series snapshots into `token_observations`. Duplicate messages are safely rejected by the database `UNIQUE(source_reference)` constraint.
5. **Decoupled Read**: The frontend queries token tables independently on page load and auto-refreshes every 10 minutes.

> [!IMPORTANT]
> **Pipeline Independence Guarantee**: Telegram token ingestion terminates strictly at Supabase PostgreSQL persistence. `telegram-poll.mjs` does **not** invoke `pushDispatcher.mjs`, and token observations do **not** trigger push notifications. `telegram-worker.mjs` is dormant in production and is not an active sequence participant.

---

## 3. Admin Web Push Notification Dispatch Sequence

This diagram models the outbox notification creation, atomic RPC claiming, VAPID cryptographic payload signing, web push delivery, dead subscription cleanup, and Service Worker notification handling.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant Admin_UI as Admin Portal (AdminNotificationManager)
    participant Supa_Auth as Supabase Auth Engine
    participant Supa_DB as Supabase PostgreSQL DB
    participant GHA as GitHub Actions Runner (Cron 10m)
    participant Outbox_Proc as processAdminNotifications.mjs
    participant Dispatcher as pushDispatcher.mjs
    participant Push_Service as Web Push Gateways (FCM / Mozilla / APNs)
    participant SW as Service Worker (public/sw.js)
    actor Devotee as Subscriber Devotee

    %% Admin Authentication & Outbox Creation
    Admin->>Admin_UI: Enter Credentials (email/password)
    Admin_UI->>Supa_Auth: signInWithPassword({ email, password })
    Supa_Auth-->>Admin_UI: Return Auth JWT Session & Admin User Object
    Admin->>Admin_UI: Draft Custom Notification (Title, Body, Target URL)
    Admin_UI->>Supa_DB: INSERT INTO admin_custom_notifications (title, body, url, status='pending')
    Supa_DB-->>Admin_UI: Confirm Outbox Record Created (status: pending)
    Admin_UI-->>Admin: Display 'Notification Queued' Status

    %% Automated Outbox Processing
    Note over GHA,Push_Service: Server-Side Outbox Processing & VAPID Dispatch
    GHA->>Outbox_Proc: Trigger Scheduled Worker (npm run process-admin-notifications)
    Outbox_Proc->>Supa_DB: SELECT * FROM admin_custom_notifications WHERE status = 'pending'
    Supa_DB-->>Outbox_Proc: Return Pending Notification Records

    loop For Each Pending Notification
        Outbox_Proc->>Supa_DB: rpc('claim_admin_notification', { p_notification_id })
        Supa_DB->>Supa_DB: UPDATE status = 'dispatching', dispatched_at = now() WHERE status = 'pending'
        Supa_DB-->>Outbox_Proc: Return claim_succeeded = true

        Outbox_Proc->>Dispatcher: dispatchWebPushNotification({ notificationType, entityId, payload })
        Dispatcher->>Supa_DB: SELECT * FROM push_subscriptions WHERE is_active = true
        Supa_DB-->>Dispatcher: Return Active Push Subscriptions List

        loop For Each Active Subscriber
            Dispatcher->>Supa_DB: rpc('claim_notification_dispatch', { type, entity_id, sub_id })
            Supa_DB->>Supa_DB: INSERT INTO notification_dispatch_logs (ON CONFLICT DO NOTHING)
            
            alt Claim Succeeded (New Dispatch Pair)
                Supa_DB-->>Dispatcher: Return claimed = true
                Dispatcher->>Dispatcher: Encrypt Payload & Sign VAPID Details (VAPID_PRIVATE_KEY)
                Dispatcher->>Push_Service: HTTP POST sendNotification(subscription, payload)
                
                alt Delivery Success (HTTP 201)
                    Push_Service-->>Dispatcher: Return 201 Created
                    Dispatcher->>Supa_DB: UPDATE push_subscriptions (last_success_at = now(), failure_count = 0)
                else Dead Subscription (HTTP 404 / 410)
                    Push_Service-->>Dispatcher: Return 404 Not Found / 410 Gone
                    Dispatcher->>Supa_DB: UPDATE push_subscriptions (is_active = false) [Cleanup]
                else Transient Network Error
                    Push_Service-->>Dispatcher: Return 50x Error
                    Dispatcher->>Supa_DB: UPDATE push_subscriptions (failure_count = failure_count + 1)
                end
            else Already Claimed by Another Instance
                Supa_DB-->>Dispatcher: Return claimed = false (Skip Duplicate)
            end
        end

        Dispatcher-->>Outbox_Proc: Return Dispatch Stats (sentCount, deactivatedCount, failedCount)
        Outbox_Proc->>Supa_DB: UPDATE admin_custom_notifications (status = 'completed', stats)
    end

    %% Client Notification Arrival & User Click
    Note over Push_Service,Devotee: Client Service Worker Notification Arrival
    Push_Service->>SW: Deliver Encrypted Web Push Payload Event
    SW->>SW: Parse Payload JSON & Validate HTTPS Destination URL
    SW->>Browser: self.registration.showNotification(title, options)
    Browser-->>Devotee: Display Banner Notification Alert
    
    Devotee->>SW: Click Notification Banner (notificationclick event)
    SW->>Browser: Focus existing open window OR clients.openWindow(safeUrl)
    Browser-->>Devotee: Open Target Application Screen
```

### Flow Explanation
1. **Admin Authentication**: The administrator authenticates via Supabase Auth (`signInWithPassword`), obtaining a valid JWT session for RLS-protected database mutations.
2. **Outbox Queueing**: Creating a custom notification inserts a row into `admin_custom_notifications` with `status = 'pending'`.
3. **Atomic Admin Notification Claim**: `processAdminNotifications.mjs` executes via GitHub Actions and calls RPC `claim_admin_notification`. The database atomically transitions `status` to `'dispatching'`, preventing duplicate worker execution.
4. **Atomic Dispatch Log Claim**: `pushDispatcher.mjs` queries active subscriptions. For each endpoint, it executes RPC `claim_notification_dispatch` to insert a record into `notification_dispatch_logs`. If the unique constraint `(notification_type, entity_id, subscription_id)` fails, the dispatch is skipped.
5. **VAPID Payload Signing**: Payloads are encrypted and cryptographically signed using the server-side `VAPID_PRIVATE_KEY` and transmitted over HTTPS to browser Push Gateways.
6. **Dead Subscription Cleanup**: Subscriptions returning HTTP `404` or `410` from push gateways are automatically marked `is_active = false` in `push_subscriptions`.
7. **Service Worker Display & Navigation**: `public/sw.js` handles the background `push` event, displays the notification banner, and handles `notificationclick` by focusing or opening the validated HTTPS destination URL.

---

## Security & Privacy Guarantee

* **Pipeline Separation**: Token ingestion and Web Push outbox processing are completely separate backend pipelines. Token observations do not trigger push notifications.
* **VAPID Key Isolation**: The VAPID private key (`VAPID_PRIVATE_KEY`) is stored exclusively as an encrypted server-side GitHub Actions secret and is never exposed to the client browser.
* **Dormant Worker Exclusion**: `telegram-worker.mjs` is dormant in production and is not included as an active sequence participant.
* **Diagnostic Privacy Guarantee**: Community Feedback is stored strictly in client browser `LocalStorage` (`tirumala_feedback_submissions`). It is not transmitted to Supabase PostgreSQL or any backend deployment node, and does **not** automatically collect browser, operating system, device, user-agent, or page-URL diagnostics.
