# Business Center storage rollout

The Business Center now uses server-side PostgreSQL tables rather than writing new tasks to browser storage. The database code supports the app's configured PostgreSQL backend; it does not provision a hosted database or deployment secrets automatically.

## Required deployment configuration

1. Provision a managed PostgreSQL database for the app. Use separate databases for staging and production, and enable backups before storing live park records.
2. Configure `DATABASE_URL` as a deployment environment secret. It must point to the intended database and be available to the build step because `npm run build` runs `scripts/migrate.mjs`, which applies versioned SQL files in `migrations/*.sql`.
3. Enable real sign-in by setting `VITE_AUTH_ENABLED=true` and configure the app's Better Auth / Grok broker settings as required by the deployment:
   - `BETTER_AUTH_URL`
   - `BETTER_AUTH_SECRET`
   - `GROK_AUTH_CLIENT_ID`
   - `GROK_AUTH_CLIENT_SECRET`
   - `GROK_AUTH_ISSUER` if the default issuer is not appropriate
4. Keep all credentials in the hosting provider's environment-secret settings, never in source control. Do not point production at a development or preview database.
5. Deploy and verify the migration created `business_tasks`, `business_task_history`, and `business_task_attachments`. Business Center server functions scope queries by the verified signed-in user ID. Do not disable authentication while a real `DATABASE_URL` is configured; the app intentionally fails closed in that case.
6. Sign in and create a test task, edit its status, upload a small test document, inspect its history, then verify the same records from a second authorized device before entering real data.

## Existing browser-only tasks

Older tasks may still exist in a browser's `localStorage`. The Business Center displays an explicit **Import to my account** action when it detects these records. Use it while signed into the intended account; it leaves the browser copy intact. Export a CSV backup before importing important records.

## Reminders and attachments

- Due-date and follow-up reminders currently appear inside the Business Center. Email, SMS, and push delivery are not configured.
- Attachments are limited to PDF, PNG, JPEG, and WebP files up to 3 MB each and are stored in PostgreSQL. If the park later needs many large documents, move file bytes to private object storage and keep only metadata in PostgreSQL.
- The change-history table records task creation, updates, and deletion events. It is not a substitute for a database backup.

## Validation

GitHub Actions runs type-check, lint, automated tests, and the production build on pull requests. A green run verifies those checks; it does not replace the deployment configuration and two-device smoke test above.
