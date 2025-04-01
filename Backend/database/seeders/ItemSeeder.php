<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run()
    {

        $items = [
            [
                'title' => 'Vintage Denim Jacket',
                'description' => 'Classic Levi\'s jacket from the 90s in great condition',
                'price' => 45.99,
                'condition' => 'good',
                'category_id' => 1, // Outerwear
                'seller_id' => 1,
                'image' => 'denim-jacket.jpg'
            ],
            [
                'title' => 'Designer Silk Blouse',
                'description' => 'Hardly worn Gucci blouse, size M',
                'price' => 89.50,
                'condition' => 'like_new',
                'category_id' => 1, // Tops
                'seller_id' => 1,
                'image' => 'silk-blouse.jpg'
            ],
            [
                'title' => 'Black Leather Boots',
                'description' => 'Dr. Martens 1460, broken in but plenty of life left',
                'price' => 75.00,
                'condition' => 'new',
                'category_id' => 1, // Footwear
                'seller_id' => 1,
                'image' => 'leather-boots.jpg'
            ],
            [
                'title' => 'Cashmere Sweater',
                'description' => '100% cashmere, perfect for winter, size L',
                'price' => 55.25,
                'condition' => 'good',
                'category_id' => 1, // Tops
                'seller_id' => 1,
                'image' => 'cashmere-sweater.jpg'
            ],
            [
                'title' => 'Tailored Wool Trousers',
                'description' => 'Excellent condition Hugo Boss trousers, waist 32',
                'price' => 65.00,
                'condition' => 'like_new',
                'category_id' => 1, // Bottoms
                'seller_id' => 1,
                'image' => 'wool-trousers.jpg'
            ]
        ];

        foreach ($items as $itemData) {
            Item::create($itemData);
        }
    }
}