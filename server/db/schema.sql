-- Personalised Fitness Assistant database schema (MySQL 8).
-- Creates every table on an empty database:
--   mysql -u <user> -p <database> < server/db/schema.sql

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `users_info` (
  `info_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'Unknown',
  `email` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `bmi` decimal(5,2) DEFAULT NULL,
  `activityLevel` enum('sedentary','lightly_active','moderately_active','very_active','extra_active') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`info_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uq_users_info_user` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `food_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `food_id` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `log_time` datetime NOT NULL,
  `protein` decimal(10,2) DEFAULT NULL,
  `carbs` decimal(10,2) DEFAULT NULL,
  `fats` decimal(10,2) DEFAULT NULL,
  `calories` decimal(10,2) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_food_logs_user_time` (`user_id`, `log_time`),
  CONSTRAINT `food_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  `text` text NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_comments_postId` (`postId`),
  KEY `fk_comments_userId` (`userId`),
  CONSTRAINT `fk_comments_postId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_post_like` (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
