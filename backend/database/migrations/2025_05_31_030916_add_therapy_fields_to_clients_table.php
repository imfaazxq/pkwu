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
        Schema::table('clients', function (Blueprint $table) {
            $table->json('therapyItems')->nullable()->after('payment');
            $table->string('therapistName')->nullable()->after('therapyItems');
            $table->text('notes')->nullable()->after('therapistName');
            $table->string('receiptNumber')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn([
                'therapyItems',
                'therapistName', 
                'notes',
                'receiptNumber'
            ]);
        });
    }
};