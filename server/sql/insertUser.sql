INSERT INTO
  users (sub, name)
VALUES
  ($1, $2)
RETURNING
  *
