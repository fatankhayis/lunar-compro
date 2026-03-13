<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Avoid relying on doctrine/dbal for column changes.
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE `products` MODIFY `link` TEXT NULL');
        DB::statement('ALTER TABLE `projects` MODIFY `link` TEXT NULL');
        DB::statement('ALTER TABLE `testimonials` MODIFY `video_url` TEXT NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE `products` MODIFY `link` VARCHAR(255) NULL');
        DB::statement('ALTER TABLE `projects` MODIFY `link` VARCHAR(255) NULL');
        DB::statement('ALTER TABLE `testimonials` MODIFY `video_url` VARCHAR(255) NOT NULL');
    }
};
