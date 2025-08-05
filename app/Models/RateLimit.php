<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\RateLimit
 *
 * @property int $id
 * @property string $ip_address
 * @property string $tool_name
 * @property int $requests_count
 * @property \Illuminate\Support\Carbon $window_start
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit query()
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit whereRequestsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit whereToolName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RateLimit whereWindowStart($value)
 * @method static \Database\Factories\RateLimitFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class RateLimit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ip_address',
        'tool_name',
        'requests_count',
        'window_start',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requests_count' => 'integer',
        'window_start' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'rate_limits';
}