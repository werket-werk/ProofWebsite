CREATE TABLE subscribers (
  email TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('pending','active','unsubscribed')),
  consent_version TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  requested_at INTEGER NOT NULL,
  confirmed_at INTEGER,
  unsubscribed_at INTEGER,
  token_hash TEXT,
  token_expires INTEGER
);
CREATE UNIQUE INDEX confirmation_token ON subscribers(token_hash) WHERE token_hash IS NOT NULL;
CREATE TABLE daily_counts (
  day TEXT NOT NULL,
  event TEXT NOT NULL,
  release TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day,event,release)
);
CREATE TRIGGER confirmed_signup AFTER UPDATE OF status ON subscribers
WHEN NEW.status = 'active' AND OLD.status = 'pending'
BEGIN
  INSERT INTO daily_counts(day,event,release,count)
  VALUES(date(NEW.confirmed_at,'unixepoch'),'confirmed_signup','',1)
  ON CONFLICT(day,event,release) DO UPDATE SET count=count+1;
END;
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires INTEGER NOT NULL
);
