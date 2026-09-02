# UML 6 — Activity Diagrams

## Overview

This document specifies the operational activity workflows of **The Tirumala Verse** application across three distinct execution pipelines:
1. **Public User Activity**: End-to-end user navigation, event exploration, schedule exports, bilingual/theme personalization, local feedback submission, and Web Push subscription management.
2. **Telegram Token Ingestion Activity**: Automated GitHub Actions cron polling, Telegram MTProto API retrieval, regex token parsing, database upserts, and duplicate handling.
3. **Admin Web Push Notification Activity**: Administrator authentication, outbox notification queueing, atomic RPC claiming, VAPID payload signing, web push dispatch, dead subscription cleanup, and Service Worker alert handling.

---

## 1. Public User Activity

This diagram details the decision paths and operational workflow of a public devotee visiting the application.

```mermaid
flowchart TD
    Start([Start]) --> OpenApp[Open The Tirumala Verse https://thetirumalaverse.in/]
    OpenApp --> LoadVite[Load Compiled React/Vite SPA Bundle]
    LoadVite --> BrowseCalendar[Browse Festival Calendar Grid]

    BrowseCalendar --> ChoiceNavigation{User Choice?}

    %% Calendar & Event Sub-branches
    ChoiceNavigation -->|Select Month/Date| NavMonth[Navigate Month Grid / Swipe Gesture]
    ChoiceNavigation -->|Temple Filter| FilterTemple[Select Temple: Tirumala, Tiruchanur, etc.]
    ChoiceNavigation -->|Search Keyword| SearchEvents[Filter Events by Title, Description, Vahanam]
    ChoiceNavigation -->|Export Schedule| ChoiceExport{Export Format?}

    ChoiceExport -->|PDF Schedule| ExportPDF[Generate PDF via pdfExport.js]
    ChoiceExport -->|iCalendar .ics| ExportICal[Generate .ics via icsExport.js]
    ExportPDF --> BrowseCalendar
    ExportICal --> BrowseCalendar

    NavMonth --> ViewEventDetails[View Event Details Modal]
    FilterTemple --> ViewEventDetails
    SearchEvents --> ViewEventDetails

    ViewEventDetails --> EventActions{Event Action?}
    EventActions -->|View Images| Lightbox[Open Image Lightbox Gallery]
    EventActions -->|View Significance| VahanamInfo[Read Vahanam & Ritual Significance]
    EventActions -->|1-Click Calendar| GoogleCal[Generate 1-Click Google Calendar Link]
    EventActions -->|WhatsApp Share| WhatsApp[Format & Share via WhatsApp]

    Lightbox --> CloseModal[Close Event Modal]
    VahanamInfo --> CloseModal
    GoogleCal --> CloseModal
    WhatsApp --> CloseModal
    CloseModal --> BrowseCalendar

    %% Navigation to Other Tabs
    ChoiceNavigation -->|Switch Tab| ChoiceTab{Target Tab?}

    ChoiceTab -->|Daily Sevas| ViewSevas[View Tirumala Nitya & Weekly Seva Timetables]
    ChoiceTab -->|SSD/DD Tokens| ViewTokens[View Live Token Status, History & Locations]
    ChoiceTab -->|Utsavam Glossary| ViewGlossary[Browse Terms, Search & Filter Categories]
    ChoiceTab -->|Personalization| ChoicePersonal{Personalization?}
    ChoiceTab -->|Web Push Alerts| TogglePush{Push Toggle?}
    ChoiceTab -->|Community Feedback| SubmitFeedback[Open Feedback Form]

    ViewSevas --> EndUser([End Session])
    ViewTokens --> EndUser
    ViewGlossary --> EndUser

    %% Personalization Options
    ChoicePersonal -->|Language| SwitchLang[Toggle Language: English / Telugu]
    ChoicePersonal -->|Theme| SwitchTheme[Toggle Theme: Velvet Midnight / Warm Ivory]
    ChoicePersonal -->|TTD Live| WatchLive[Watch Embedded TTD YouTube Stream]
    SwitchLang --> EndUser
    SwitchTheme --> EndUser
    WatchLive --> EndUser

    %% Push Subscription Branch
    TogglePush -->|Enable| ReqPerm[Request Browser Notification Permission]
    ReqPerm --> PermGranted{Permission Granted?}
    PermGranted -->|No| PushDenied[Display Permission Denied Toast] --> EndUser
    PermGranted -->|Yes| RegisterSW[Register Service Worker public/sw.js]
    RegisterSW --> GenSub[Generate PushSubscription Object]
    GenSub --> CallRPC[Invoke register_push_subscription RPC]
    CallRPC --> PushActive[Update push_subscriptions Table] --> EndUser
    TogglePush -->|Disable| UnsubPush[Invoke unsubscribe_push_subscription RPC] --> EndUser

    %% Feedback Branch (LocalStorage Privacy Boundary)
    SubmitFeedback --> CompleteCaptcha[Complete Math CAPTCHA]
    CompleteCaptcha --> AttachImg{Attach Screenshot?}
    AttachImg -->|Yes| Base64Img[Convert Screenshot to Base64 Data URL]
    AttachImg -->|No| SaveLocal[Save Submission Record]
    Base64Img --> SaveLocal
    SaveLocal --> LocalStorage[Persist in Browser LocalStorage: tirumala_feedback_submissions]
    LocalStorage --> FeedbackToast[Display Success Toast]
    FeedbackToast --> EndUser
```

### Flow Explanation
1. **Interactive Event Exploration**: Devotees browse the festival grid, apply temple filters, search titles, or open detailed event popups with options to share via WhatsApp, add to Google Calendar, or export PDF/iCal schedules.
2. **Tab Navigation**: Users transition seamlessly between Daily Sevas timetables, SSD/DD token status, Utsavam glossary searches, and live YouTube streams.
3. **Personalization & Push Opt-In**: Users switch between English/Telugu, toggle Dark/Light themes, or register for Web Push notifications through the `register_push_subscription` RPC.
4. **Local Feedback Privacy**: Submitting community feedback requires a CAPTCHA and optional screenshot attachment. Submissions are persisted strictly inside browser `LocalStorage` (`tirumala_feedback_submissions`). No network data transmission to backend databases occurs.

---

## 2. Telegram Token Processing Activity

This diagram models the automated backend ingestion pipeline executed by GitHub Actions every 10 minutes.

```mermaid
flowchart TD
    StartCron([Start Cron Trigger: */10 * * * *]) --> LaunchJob[GitHub Actions Executes telegram-token-poll.yml]
    LaunchJob --> ExecScript[Run node telegram-poll.mjs with Server Secrets]
    ExecScript --> ConnectTelegram[Connect to Telegram MTProto API via teleproto]
    ConnectTelegram --> FetchMsgs[Fetch Recent 500 Channel Messages from LaxmiTeluguTechChannel]
    FetchMsgs --> FilterToday[Filter Messages for Today's India Date: Asia/Kolkata]
    
    FilterToday --> HasMsgs{Today Messages Found?}
    HasMsgs -->|No| DisconnectMTProto[Disconnect Telegram Session] --> LogEmpty[Log '0 Today Messages'] --> EndPoll([End Job])
    
    HasMsgs -->|Yes| LoopMsgs[Loop Through Today Messages]
    LoopMsgs --> ParseMsg[Parse Text via telegramTokenParser.js]

    ParseMsg --> IsRecognized{Is Token Message?}
    IsRecognized -->|No| NextMsg{More Messages?}
    IsRecognized -->|Yes| CheckDay[Check token_days for Today's Date]

    CheckDay --> DayExists{token_days Row Exists?}
    DayExists -->|No| CreateDay[Insert New token_days Record: issuance_date, status]
    DayExists -->|Yes| CheckTimings{New Timings Discovered?}
    CreateDay --> CheckTimings

    CheckTimings -->|Yes| UpdateTimings[Update token_days: issuance_started_at, completed_at]
    CheckTimings -->|No| ProcessObs{Is Token Count Observation?}
    UpdateTimings --> ProcessObs

    ProcessObs -->|No - Timing Message Only| NextMsg
    ProcessObs -->|Yes| InsertObs[Insert Row into token_observations via Service Role Key]

    InsertObs --> ObsError{Insert Success?}
    ObsError -->|Yes| IncInserted[Increment Inserted Counter]
    ObsError -->|No - Code 23505 Duplicate| IncDup[Increment Duplicates Counter]

    IncInserted --> NextMsg
    IncDup --> NextMsg

    NextMsg -->|Yes| LoopMsgs
    NextMsg -->|No| DisconnectMTProto
    DisconnectMTProto --> LogSummary[Log Ingestion Summary: Inserted, Duplicates, Other]
    LogSummary --> EndPoll
```

### Flow Explanation
1. **Automated Cron Trigger**: GitHub Actions runs `telegram-poll.mjs` every 10 minutes.
2. **MTProto Retrieval & Regex Parsing**: Fetches recent messages from `LaxmiTeluguTechChannel` and parses token counts, start times, completion times, and status flags using `telegramTokenParser.js`.
3. **Database Upserts & Deduplication**: Inserts daily state into `token_days` and time-series records into `token_observations`. Duplicate messages are safely caught and rejected by the `UNIQUE(source_reference)` constraint (HTTP 23505 duplicate code).

> [!IMPORTANT]
> **Pipeline Independence Guarantee**: Token ingestion runs strictly between Telegram, GitHub Actions, and Supabase PostgreSQL. `telegram-poll.mjs` does **not** call `pushDispatcher.mjs` or `processAdminNotifications.mjs`. Token observations do **not** trigger push notifications. `telegram-worker.mjs` is dormant in production and is not an active activity participant.

---

## 3. Admin Web Push Notification Activity

This diagram models outbox notification creation, administrator authentication, atomic RPC claiming, VAPID payload signing, push delivery, dead subscription cleanup, and Service Worker alert display.

```mermaid
flowchart TD
    StartAdmin([Start Admin Action]) --> OpenAdmin[Administrator Opens Admin Portal Modal]
    OpenAdmin --> EnterCreds[Enter Email & Password]
    EnterCreds --> SubmitAuth[Submit Supabase Auth Login]
    SubmitAuth --> AuthSuccess{Auth Successful?}

    AuthSuccess -->|No| AuthError[Display Authentication Error Message] --> EndAdmin([End Session])

    AuthSuccess -->|Yes| OpenNotifMgr[Open Push Notification Manager Tab]
    OpenNotifMgr --> ViewSubCount[Query Active Subscriber Count via RPC]
    ViewSubCount --> DraftNotif[Enter Title, Body, and Target Destination URL]
    DraftNotif --> InsertOutbox[INSERT INTO admin_custom_notifications: status = 'pending']
    InsertOutbox --> ShowQueuedToast[Display Notification Queued Status] --> EndAdmin

    %% Server-Side Outbox Worker Execution
    StartOutboxWorker([GitHub Actions Scheduled Trigger]) --> ExecProcess[Run node processAdminNotifications.mjs]
    ExecProcess --> QueryPending[SELECT * FROM admin_custom_notifications WHERE status = 'pending']
    QueryPending --> HasPending{Pending Notifications Found?}

    HasPending -->|No| LogNoPending[Log 'No Pending Custom Notifications'] --> EndWorker([End Worker])

    HasPending -->|Yes| LoopPending[Loop Through Pending Notification Rows]
    LoopPending --> ClaimNotif[Invoke RPC claim_admin_notification]

    ClaimNotif --> ClaimSuccess{Claim Succeeded?}
    ClaimSuccess -->|No - Claimed by Other Instance| NextPending{More Notifications?}
    ClaimSuccess -->|Yes - status = 'dispatching'| DispatchInit[Invoke dispatchWebPushNotification]

    DispatchInit --> QuerySubs[SELECT * FROM push_subscriptions WHERE is_active = true]
    QuerySubs --> LoopSubs[Loop Through Active Subscriptions]

    LoopSubs --> ClaimDispatch[Invoke RPC claim_notification_dispatch]
    ClaimDispatch --> DispatchClaimed{Claim Succeeded?}

    DispatchClaimed -->|No - Already Dispatched| NextSub{More Subscriptions?}
    DispatchClaimed -->|Yes| SignVAPID[Encrypt Payload & Sign VAPID Details via VAPID_PRIVATE_KEY]

    SignVAPID --> SendPush[HTTP POST sendNotification to Push Gateway FCM/Mozilla/APNs]
    SendPush --> HTTPStatus{HTTP Response Code?}

    HTTPStatus -->|201 Success| UpdateSubSuccess[UPDATE push_subscriptions: last_success_at = now, failure_count = 0]
    HTTPStatus -->|404 / 410 Dead Sub| CleanupSub[UPDATE push_subscriptions: is_active = false]
    HTTPStatus -->|Transient Error| IncFailCount[UPDATE push_subscriptions: failure_count = failure_count + 1]

    UpdateSubSuccess --> NextSub
    CleanupSub --> NextSub
    IncFailCount --> NextSub

    NextSub -->|Yes| LoopSubs
    NextSub -->|No| CompleteNotifRow[UPDATE admin_custom_notifications: status = 'completed', final stats]

    CompleteNotifRow --> NextPending
    NextPending -->|Yes| LoopPending
    NextPending -->|No| LogComplete[Log Outbox Processor Finished] --> EndWorker

    %% Client Arrival & Click Sequence
    SendPush -.->|Web Push Protocol Delivery| SWPush[Service Worker public/sw.js Receives push Event]
    SWPush --> ValidateURL[Sanitize Destination URL HTTPS Protocol]
    ValidateURL --> ShowBanner[Display Desktop/Mobile Notification Alert]
    ShowBanner --> UserClick{User Clicks Banner?}
    UserClick -->|Yes| OpenURL[Focus Existing Window OR Open Target Destination URL]
```

### Flow Explanation
1. **Outbox Creation**: Administrators authenticate via Supabase Auth (`signInWithPassword`) and draft notification payloads, inserting rows into `admin_custom_notifications` with `status = 'pending'`.
2. **Atomic Notification Claiming**: `processAdminNotifications.mjs` runs via GitHub Actions and executes RPC `claim_admin_notification`. The database atomically transitions `status` to `'dispatching'`, eliminating race conditions across concurrent workers.
3. **Atomic Dispatch Log Claiming**: `pushDispatcher.mjs` executes RPC `claim_notification_dispatch` for each subscriber. If inserted into `notification_dispatch_logs`, the claim succeeds; duplicate pairs are safely skipped.
4. **VAPID Delivery & Dead Subscription Cleanup**: Payloads are cryptographically signed using the server-side `VAPID_PRIVATE_KEY` and transmitted to push gateways. Gateways returning HTTP `404` or `410` trigger immediate cleanup, marking subscriptions `is_active = false`.
5. **Service Worker Display**: `public/sw.js` handles the background `push` event, displays the notification banner, and handles `notificationclick` navigation to the validated HTTPS URL.

---

## Security & Privacy Guarantee

* **Pipeline Independence**: Telegram token ingestion and Web Push outbox processing are completely independent backend pipelines. Token observations do not trigger push notifications.
* **Server-Side VAPID Key Isolation**: The VAPID private key (`VAPID_PRIVATE_KEY`) is stored exclusively as an encrypted secret in GitHub Actions and is never exposed to client browsers.
* **Dormant Worker Exclusion**: `telegram-worker.mjs` is dormant in production and is not included as an active activity participant.
* **Diagnostic Privacy Guarantee**: Community Feedback is stored strictly in client browser `LocalStorage` (`tirumala_feedback_submissions`). It is not transmitted to Supabase PostgreSQL or any backend deployment node, and does **not** automatically collect browser, operating system, device, user-agent, or page-URL diagnostics.
