-- Shared, per-user Business Center data: tasks, change history, and small attachments.
-- Every query must scope by user_id from the verified auth middleware.
CREATE TABLE IF NOT EXISTS business_tasks (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  due_date DATE,
  follow_up DATE,
  status TEXT NOT NULL DEFAULT 'Open',
  owner TEXT NOT NULL DEFAULT '',
  cost TEXT NOT NULL DEFAULT '',
  reference TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, id)
);
CREATE INDEX IF NOT EXISTS business_tasks_user_due_idx
  ON business_tasks (user_id, due_date) WHERE status <> 'Completed';
CREATE TABLE IF NOT EXISTS business_task_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  action TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_task_history_user_task_idx
  ON business_task_history (user_id, task_id, changed_at DESC);
CREATE TABLE IF NOT EXISTS business_task_attachments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  data_base64 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_task_attachments_user_task_idx
  ON business_task_attachments (user_id, task_id, created_at DESC);
