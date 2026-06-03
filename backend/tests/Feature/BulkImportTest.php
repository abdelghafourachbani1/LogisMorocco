<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BulkImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_template_download_is_successful()
    {
        $merchant = User::factory()->create(['role' => 'merchant']);

        $response = $this->actingAs($merchant)
            ->get('/api/orders/import/template');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $this->assertStringContainsString('customer_name,customer_phone,customer_address,amount_cod', $response->streamedContent());
    }

    public function test_import_preview_validates_rows()
    {
        $merchant = User::factory()->create(['role' => 'merchant']);

        $payload = [
            'rows' => [
                [
                    'customer_name' => 'John Doe',
                    'customer_phone' => '0612345678',
                    'customer_address' => 'Rabat',
                    'amount_cod' => '150.00'
                ],
                [
                    'customer_name' => '',
                    'customer_phone' => '0699999999',
                    'customer_address' => '',
                    'amount_cod' => '-10'
                ]
            ]
        ];

        $response = $this->actingAs($merchant)
            ->postJson('/api/orders/import/preview', $payload);

        $response->assertStatus(200);
        $response->assertJson([
            'valid_count' => 1,
            'invalid_count' => 1,
        ]);
    }

    public function test_import_confirm_creates_orders()
    {
        $merchant = User::factory()->create(['role' => 'merchant']);

        $payload = [
            'rows' => [
                [
                    'customer_name' => 'John Doe',
                    'customer_phone' => '0612345678',
                    'customer_address' => 'Rabat',
                    'amount_cod' => 150.00
                ],
                [
                    'customer_name' => 'Jane Smith',
                    'customer_phone' => '0611111111',
                    'customer_address' => 'Casablanca',
                    'amount_cod' => 200.50
                ]
            ]
        ];

        $response = $this->actingAs($merchant)
            ->postJson('/api/orders/import/confirm', $payload);

        $response->assertStatus(201);
        $response->assertJson([
            'imported_count' => 2
        ]);

        $this->assertDatabaseHas('orders', [
            'merchant_id' => $merchant->id,
            'customer_name' => 'John Doe',
            'amount_cod' => 150.00
        ]);

        $this->assertDatabaseHas('orders', [
            'merchant_id' => $merchant->id,
            'customer_name' => 'Jane Smith',
            'amount_cod' => 200.50
        ]);
    }
}
