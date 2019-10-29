SELECT
  `id`,
  `title`,
  `created_date`,
  `thumbnail`,
  `desc`
FROM
  `qdm174930677_db`.`xek_article`
WHERE
  TYPE = 1
  AND title LIKE "%文法%主题%"
ORDER BY
  `created_date` DESC
LIMIT
  0, 10;

SELECT
  `open_date`,
  `title`,
  `address`
FROM
  `qdm174930677_db`.`xek_active`;

UPDATE `qdm174930677_db`.`xek_active` SET `address` = '学术报告厅' WHERE id = '167';