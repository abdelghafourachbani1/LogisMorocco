<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $products = Product::where('merchant_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'image_url' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $product = Product::create([
            'merchant_id' => $user->id,
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'weight' => $request->weight,
            'image_url' => $request->image_url,
            'status' => $request->status ?? 'active',
        ]);

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::where('merchant_id', $user->id)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku,' . $id,
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'image_url' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $product->update([
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'weight' => $request->weight,
            'image_url' => $request->image_url,
            'status' => $request->status ?? $product->status,
        ]);

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::where('merchant_id', $user->id)->findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.'
        ]);
    }
}
