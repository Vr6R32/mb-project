-- CREATE TABLE IF NOT EXISTS cities (
--                                       id SERIAL PRIMARY KEY,
--                                       state_id INT NOT NULL DEFAULT 0,
--                                       name VARCHAR(150) NOT NULL DEFAULT '0',
--                                       n_latitude DECIMAL(9, 6) NOT NULL DEFAULT 0,
--                                       e_longitude DECIMAL(9, 6) NOT NULL DEFAULT 0
-- );


UPDATE cities
SET n_latitude = CASE
                     WHEN name = 'Kobryń' THEN (52 + 13/60)
                     WHEN name = 'Kobyla Góra' THEN (51 + 23/60)
                     WHEN name = 'Kobylanka' THEN (53 + 21/60)
                     WHEN name = 'Kobylin' THEN (51 + 42/60)
                     WHEN name = 'Kobylin-Borzymy' THEN (53 + 6/60)
                     WHEN name = 'Kobylnica' THEN (54 + 27/60)
                     WHEN name = 'Kobyłka' THEN (52 + 21/60)
                     WHEN name = 'Kochanowice' THEN (50 + 43/60)
                     WHEN name = 'Kocierzew Południowy' THEN (52 + 14/60)
                     WHEN name = 'Kock' THEN (51 + 39/60)
                     WHEN name = 'Kocmyrzów-Luborzyca' THEN (50 + 8/60)
                     WHEN name = 'Koczała' THEN (53 + 54/60)
                     WHEN name = 'Kodeń' THEN (51 + 55/60)
                     WHEN name = 'Kodrąb' THEN (51 + 6/60)
                     WHEN name = 'Kolbudy Górne' THEN (54 + 16/60)
    END,
    e_longitude = CASE
                      WHEN name = 'Kobryń' THEN (24 + 21/60)
                      WHEN name = 'Kobyla Góra' THEN (17 + 51/60)
                      WHEN name = 'Kobylanka' THEN (14 + 51/60)
                      WHEN name = 'Kobylin' THEN (17 + 14/60)
                      WHEN name = 'Kobylin-Borzymy' THEN (22 + 41/60)
                      WHEN name = 'Kobylnica' THEN (16 + 59/60)
                      WHEN name = 'Kobyłka' THEN (21 + 11/60)
                      WHEN name = 'Kochanowice' THEN (18 + 45/60)
                      WHEN name = 'Kocierzew Południowy' THEN (20 + 1/60)
                      WHEN name = 'Kock' THEN (22 + 27/60)
                      WHEN name = 'Kocmyrzów-Luborzyca' THEN (20 + 6/60)
                      WHEN name = 'Koczała' THEN (17 + 4/60)
                      WHEN name = 'Kodeń' THEN (22 + 37/60)
                      WHEN name = 'Kodrąb' THEN (19 + 38/60)
                      WHEN name = 'Kolbudy Górne' THEN (18 + 27/60)
        END
WHERE name IN (
               'Kobryń', 'Kobyla Góra', 'Kobylanka', 'Kobylin', 'Kobylin-Borzymy',
               'Kobylnica', 'Kobyłka', 'Kochanowice', 'Kocierzew Południowy',
               'Kock', 'Kocmyrzów-Luborzyca', 'Koczała', 'Kodeń', 'Kodrąb', 'Kolbudy Górne'
    );