<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::all();
        return response()->json($clients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'complaint' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Hanya ambil field yang diizinkan
        $data = $request->only(['name', 'phone', 'address', 'complaint']);
        
        $client = Client::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Client created successfully',
            'data' => $client
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::find($id);
        
        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }
        
        return response()->json($client);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'address' => 'nullable|string',
            'complaint' => 'nullable|string',
            'status' => 'sometimes|in:on progress,selesai',
            'completedDate' => 'nullable|date',
            'payment' => 'nullable|numeric',
            // TAMBAHKAN VALIDASI UNTUK FIELD BARU
            'therapyItems' => 'nullable|array',
            'therapyItems.*.type' => 'required_with:therapyItems|string',
            'therapyItems.*.quantity' => 'required_with:therapyItems|integer|min:1',
            'therapyItems.*.pricePerSession' => 'required_with:therapyItems|numeric|min:0',
            'therapyItems.*.total' => 'required_with:therapyItems|numeric|min:0',
            'therapistName' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'receiptNumber' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Ambil hanya field yang diizinkan
        $allowedFields = [
            'name', 'phone', 'address', 'complaint', 'status', 
            'completedDate', 'payment', 'therapyItems', 'therapistName', 
            'notes', 'receiptNumber'
        ];
        
        $data = $request->only($allowedFields);
        
        // Log data yang akan diupdate untuk debugging
        \Log::info('Updating client with data:', $data);
        
        $client->update($data);
        
        // Refresh client untuk mendapatkan data terbaru
        $client->refresh();
        
        \Log::info('Client after update:', $client->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Client updated successfully',
            'data' => $client
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client deleted successfully'
        ]);
    }
}