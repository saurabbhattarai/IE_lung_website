-- CreateTable
CREATE TABLE `download_resources` (
    `id` VARCHAR(191) NOT NULL,
    `category` ENUM('NEWSLETTER', 'FORMS', 'GUIDES', 'BROCHURES') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(255) NULL,
    `issueNumber` INTEGER NULL,
    `edition` VARCHAR(100) NULL,
    `publicationDate` DATETIME(3) NULL,
    `description` TEXT NOT NULL,
    `fileUrl` VARCHAR(1000) NOT NULL,
    `filePublicId` VARCHAR(255) NULL,
    `fileSize` VARCHAR(50) NULL,
    `pageCount` VARCHAR(50) NULL,
    `topics` JSON NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'PUBLISHED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `download_resources_category_idx`(`category`),
    INDEX `download_resources_status_idx`(`status`),
    INDEX `download_resources_sortOrder_idx`(`sortOrder`),
    INDEX `download_resources_featured_idx`(`featured`),
    INDEX `download_resources_publicationDate_idx`(`publicationDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_images` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'Opening Day',
    `src` VARCHAR(1000) NOT NULL,
    `publicId` VARCHAR(255) NULL,
    `alt` VARCHAR(500) NOT NULL,
    `aspect` VARCHAR(50) NULL DEFAULT 'landscape',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'PUBLISHED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `gallery_images_category_idx`(`category`),
    INDEX `gallery_images_status_idx`(`status`),
    INDEX `gallery_images_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
