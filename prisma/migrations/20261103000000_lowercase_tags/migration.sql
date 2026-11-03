-- Normalise les tags existants en minuscules (dédoublonnés, ordre conservé)
UPDATE "Cat"
SET "tags" = ARRAY(
  SELECT lower(u.t)
  FROM unnest("tags") WITH ORDINALITY AS u(t, n)
  GROUP BY lower(u.t)
  ORDER BY min(u.n)
);
