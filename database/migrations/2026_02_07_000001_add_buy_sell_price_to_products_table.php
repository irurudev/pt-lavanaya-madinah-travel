<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('buy_price', 15, 2)->after('min_stock');
            $table->decimal('sell_price', 15, 2)->after('buy_price');
        });

        // Isi harga beli/jual dari unit_price agar data lama tetap konsisten
        DB::table('products')->update([
            'buy_price' => DB::raw('unit_price'),
            'sell_price' => DB::raw('unit_price'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['buy_price', 'sell_price']);
        });
    }
};
