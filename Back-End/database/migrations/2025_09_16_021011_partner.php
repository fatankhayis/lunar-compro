<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id('partner_id');
            $table->string('name');
            $table->string('partner_image');
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    // $table->enum('category', ['schools', 'international_partnership', 'community_partnership', 'partnership', 'project_partner', 'LOI']);
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
