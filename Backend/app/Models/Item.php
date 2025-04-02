<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'seller_id',
        'category_id',
        'title',
        'description',
        'image',
        'price',
        'condition',
        'is_sold',
        'published_at',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function likesCount()
    {
        return $this->favoritedBy()->count();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

}