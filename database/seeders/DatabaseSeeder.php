<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'test',
            'email' => 'test@example.com',
        ]);

        $user = User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
        ]);

        // Create the admin rol
        $adminRole = Role::create(['name' => 'admin']);

        $user->assignRole($adminRole);

    }
}
