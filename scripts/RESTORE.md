# 🛠️ Supabase Disaster Recovery & Database Restoration Guide

This document outlines the step-by-step procedure for retrieving automated database backups from GitHub Actions artifacts and restoring roles, schemas, RLS policies, and table data into a Supabase PostgreSQL instance.

---

## 1. 📥 Downloading the Backup Artifact

1. Navigate to the repository on GitHub: `https://github.com/thetirumalaverse-710/calendar` (or your repository fork).
2. Click on the **Actions** tab.
3. Under **Workflows**, select **Daily Supabase Database Backup**.
4. Click on the most recent successful workflow run.
5. Under the **Artifacts** section at the bottom, click on `supabase-backup-YYYYMMDD_HHMMSS.tar.gz` to download the backup package.
6. Extract the downloaded archive locally:
   ```bash
   tar -xzvf supabase-backup-*.tar.gz
   ```
7. Verify that the extracted folder contains three SQL dump files:
   - `roles.sql` — Database roles, user grants, and permissions.
   - `database.sql` — Full DDL schema, tables, constraints, functions, and RLS policies.
   - `data.sql` — Table data records for `events`, `glossary`, `token_days`, and `token_observations`.

---

## 2. 🔄 Step-by-Step Restoration Procedure

> [!IMPORTANT]
> Always test database restoration in a staging environment before applying to a production instance.

Set your target Supabase connection string as an environment variable in your terminal session:

```bash
export SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Step 2.1: Restore Database Roles & Privileges
Restore database roles and permissions first to ensure schema ownership matches:
```bash
psql "$SUPABASE_DB_URL" -f roles.sql
```

### Step 2.2: Restore Schema & Row Level Security (RLS) Policies
Restore the table definitions, functions, extensions, and RLS policies:
```bash
psql "$SUPABASE_DB_URL" -f database.sql
```

### Step 2.3: Restore Table Data
Restore table data records for `events`, `glossary`, `token_days`, and `token_observations`:
```bash
psql "$SUPABASE_DB_URL" -f data.sql
```

---

## 3. ✅ Post-Restoration Verification

After running the three restoration commands, verify database integrity:

```sql
-- Connect using psql or Supabase Dashboard SQL Editor
SELECT count(*) FROM events;
SELECT count(*) FROM glossary;
SELECT count(*) FROM token_days;
SELECT count(*) FROM token_observations;
```

Verify that Row Level Security remains active:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```
