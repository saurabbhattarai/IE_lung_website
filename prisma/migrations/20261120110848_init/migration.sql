-- CreateTable
CREATE TABLE `blog_posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` JSON NOT NULL,
    `coverImage` VARCHAR(1000) NULL,
    `coverImagePublicId` VARCHAR(255) NULL,
    `author` VARCHAR(100) NOT NULL DEFAULT 'Inland Empire Lung & Sleep Institute',
    `readingTimeMinutes` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `faqs` JSON NULL,
    `showDoctorsSection` BOOLEAN NOT NULL DEFAULT false,
    `doctorSpecialtyOverrides` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_posts_slug_key`(`slug`),
    INDEX `blog_posts_status_idx`(`status`),
    INDEX `blog_posts_publishedAt_idx`(`publishedAt`),
    INDEX `blog_posts_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter_subscribers` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `status` ENUM('ACTIVE', 'UNSUBSCRIBED') NOT NULL DEFAULT 'ACTIVE',
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unsubscribedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `newsletter_subscribers_email_key`(`email`),
    INDEX `newsletter_subscribers_status_idx`(`status`),
    INDEX `newsletter_subscribers_subscribedAt_idx`(`subscribedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
