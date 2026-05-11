<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Add status: 'draft', 'pending_approval', 'published', 'archived'
            $table->enum('status', ['draft', 'pending_approval', 'published', 'archived'])
                  ->default('draft')
                  ->after('is_published');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
