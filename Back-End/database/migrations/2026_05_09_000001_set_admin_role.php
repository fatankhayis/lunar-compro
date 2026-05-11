<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Set admin users to super_admin role if they don't have a role yet
        DB::table('users')
            ->where('email', 'admin@lunar.test')
            ->whereIn('role', ['blog_author', null])
            ->update(['role' => 'super_admin']);
    }

    public function down(): void
    {
        // No revert needed
    }
};
