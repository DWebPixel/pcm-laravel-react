<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Contact;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       User::factory()->create([
            'first_name' => 'Durgesh',
            'last_name' => 'Tayade',
            'bc_address' => 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kftjhx0wlh',
            'email' => 'durgesh@dwebpixel.com',
            'password' => Hash::make('Password@2023'),
            'is_admin' => true
        ]);
    }
}
