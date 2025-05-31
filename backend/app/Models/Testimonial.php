<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position', 
        'text',
        'media_path',
        'media_type',
        'is_active',
        'status' // Added status to fillable
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the media URL attribute.
     */
    public function getMediaUrlAttribute()
    {
        if ($this->media_path) {
            return Storage::disk('public')->url($this->media_path);
        }
        return null;
    }

    /**
     * Scope for active testimonials.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for approved testimonials.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for pending testimonials.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}