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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'accepted', 'declined', 'cancelled', 'completed'])->default('pending');
            $table->timestamp('ordered_at')->nullable();
            $table->string('payment_status')->default('pending');
            $table->string('payment_id')->nullable();
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    } 
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
