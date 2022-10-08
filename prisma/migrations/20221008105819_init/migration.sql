-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,
    `role` ENUM('TECHNICIAN', 'RECEPTION', 'ADMIN') NOT NULL DEFAULT 'TECHNICIAN',

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_username_idx`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_model` VARCHAR(191) NOT NULL,
    `product_brand` VARCHAR(191) NULL,
    `product_type` VARCHAR(191) NULL,

    UNIQUE INDEX `Product_product_model_key`(`product_model`),
    INDEX `Product_product_model_idx`(`product_model`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` MEDIUMTEXT NULL,
    `observations` MEDIUMTEXT NULL,
    `contact` MEDIUMTEXT NULL,
    `phone_number` MEDIUMTEXT NULL,
    `status` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `wilaya` VARCHAR(191) NULL,

    UNIQUE INDEX `Client_name_key`(`name`),
    INDEX `Client_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` VARCHAR(191) NOT NULL,
    `observations` MEDIUMTEXT NULL,
    `entry_date` VARCHAR(191) NULL,
    `entry_time` VARCHAR(191) NULL,
    `warranty` VARCHAR(191) NULL,
    `global` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `clientId` INTEGER NOT NULL,

    UNIQUE INDEX `Entry_entry_id_key`(`entry_id`),
    INDEX `Entry_entry_id_entry_date_idx`(`entry_id`, `entry_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER NOT NULL,
    `entryId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `prestation_id` VARCHAR(191) NULL,
    `awaiting_intervention` VARCHAR(191) NULL,
    `warranty` VARCHAR(191) NULL,
    `repaired_date` VARCHAR(191) NULL,
    `exit_date` VARCHAR(191) NULL,
    `designation` MEDIUMTEXT NULL,
    `diagnostic` MEDIUMTEXT NULL,
    `status` MEDIUMTEXT NULL,
    `serial_number` MEDIUMTEXT NULL,
    `new_serial_number` MEDIUMTEXT NULL,
    `localisation` VARCHAR(191) NULL,
    `technician` VARCHAR(191) NULL,
    `entry_subid` VARCHAR(191) NULL,
    `product_same_model` VARCHAR(191) NULL,
    `used_parts` VARCHAR(191) NULL,
    `spare_parts` VARCHAR(191) NULL,
    `rma_asus` VARCHAR(191) NULL,

    UNIQUE INDEX `Job_job_id_key`(`job_id`),
    INDEX `Job_job_id_idx`(`job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `delivery_id` VARCHAR(191) NOT NULL,
    `delivery_date` VARCHAR(191) NULL,
    `clientId` INTEGER NOT NULL,
    `entry_id` VARCHAR(191) NULL,
    `sage_exit_id` VARCHAR(191) NULL,
    `delivery_date_1` VARCHAR(191) NULL,
    `observations` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Delivery_delivery_id_key`(`delivery_id`),
    INDEX `Delivery_delivery_id_idx`(`delivery_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(191) NOT NULL,
    `order_content` MEDIUMTEXT NULL,
    `observations` MEDIUMTEXT NULL,
    `order_date` VARCHAR(191) NULL,
    `receipt_date` VARCHAR(191) NULL,
    `sage_entry_id` VARCHAR(191) NULL,
    `quantity` VARCHAR(191) NULL,
    `payment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Order_order_id_key`(`order_id`),
    INDEX `Order_order_id_idx`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prestation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prestation_id` VARCHAR(191) NOT NULL,
    `prestation_date` VARCHAR(191) NULL,
    `clientId` INTEGER NOT NULL,
    `observations` MEDIUMTEXT NULL,
    `is_paid` VARCHAR(191) NULL,
    `to_bill` VARCHAR(191) NULL,
    `recovery_date` VARCHAR(191) NULL,
    `payment_date` VARCHAR(191) NULL,
    `total_amount` VARCHAR(191) NULL,
    `invoice` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Prestation_prestation_id_key`(`prestation_id`),
    INDEX `Prestation_prestation_id_idx`(`prestation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrestationDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prestationId` INTEGER NOT NULL,
    `is_paid` VARCHAR(191) NULL,
    `to_bill` VARCHAR(191) NULL,
    `payment_date` VARCHAR(191) NULL,
    `payment_method` VARCHAR(191) NULL,
    `invoice` VARCHAR(191) NULL,
    `prestation_date` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `price_ht` VARCHAR(191) NULL,
    `price_ttc` VARCHAR(191) NULL,
    `quantity` VARCHAR(191) NULL,
    `subtotal` VARCHAR(191) NULL,
    `total_amount` VARCHAR(191) NULL,
    `observations` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `current_entry_id` VARCHAR(191) NOT NULL,
    `current_delivery_id` VARCHAR(191) NOT NULL,
    `current_job_id` INTEGER NOT NULL,
    `current_order_id` VARCHAR(191) NOT NULL,
    `current_prestation_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
