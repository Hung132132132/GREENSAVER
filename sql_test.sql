CREATE TABLE `member` (
  `name` varchar(45) NOT NULL DEFAULT 'aaa',
  `phone` varchar(45) NOT NULL DEFAULT 'aaa',
  `email` varchar(45) NOT NULL DEFAULT 'aaa',
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
