<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update existing posts with null status to have a default status
        // If is_published is true, set to 'published', otherwise 'draft'
        DB::table('posts')
            ->whereNull('status')
            ->update([
                'status' => DB::raw("CASE WHEN is_published = true THEN 'published' ELSE 'draft' END")
            ]);
    }

    public function down(): void
    {
        // Revert to null
        DB::table('posts')
            ->where('status', '!=', null)
            ->update(['status' => null]);
    }
};
