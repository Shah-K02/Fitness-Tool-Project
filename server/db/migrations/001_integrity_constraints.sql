-- Brings a database created before server/db/schema.sql up to date.
--   mysql -u <user> -p <database> < server/db/migrations/001_integrity_constraints.sql
-- Fails (and changes nothing further) if duplicate emails already exist in
-- `users`; remove the duplicates first.

-- One account per email.
ALTER TABLE `users`
  MODIFY `email` varchar(255) NOT NULL,
  ADD UNIQUE KEY `uq_users_email` (`email`);

-- One profile per user.
ALTER TABLE `users_info` ADD UNIQUE KEY `uq_users_info_user` (`user_id`);

-- Deleting a post removes its likes (previously blocked the delete);
-- deleting a user removes everything they own.
ALTER TABLE `likes`
  DROP FOREIGN KEY `likes_ibfk_1`,
  DROP FOREIGN KEY `likes_ibfk_2`;
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `users_info` DROP FOREIGN KEY `fk_user_id`;
ALTER TABLE `users_info`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `food_logs` DROP FOREIGN KEY `food_logs_ibfk_1`;
ALTER TABLE `food_logs`
  ADD CONSTRAINT `food_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD KEY `idx_food_logs_user_time` (`user_id`, `log_time`);

-- comments had each foreign key defined twice; keep one of each.
ALTER TABLE `comments`
  DROP FOREIGN KEY `comments_ibfk_1`,
  DROP FOREIGN KEY `comments_ibfk_2`;
