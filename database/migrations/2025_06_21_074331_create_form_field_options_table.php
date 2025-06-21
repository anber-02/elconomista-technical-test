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
        Schema::create('form_field_options', function (Blueprint $table) {
            $table->id();
            $table->string('key')->comment('The key of the option');
            $table->string('value')->comment('The value of the option');
            $table->foreignId('form_field_id')
                ->constrained('form_fields')
                ->onDelete('cascade')
                ->comment('Foreign key to the form fields table');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_field_options');
    }
};
