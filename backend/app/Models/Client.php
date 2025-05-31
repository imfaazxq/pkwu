<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'complaint',
        'status',
        'completedDate',
        'payment',
        'therapyItems',        
        'therapistName',       
        'notes',              
        'receiptNumber'       
    ];


    protected $casts = [
        'therapyItems' => 'array',  
        'completedDate' => 'date',
        'payment' => 'decimal:2'
    ];
}