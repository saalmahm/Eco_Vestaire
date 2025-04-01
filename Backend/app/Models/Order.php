<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'seller_id',
        'buyer_id',
        'item_id',
        'status',
        'ordered_at',
        'payment_status',
        'payment_id',
        'amount_paid',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
    public function buyer() 
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
