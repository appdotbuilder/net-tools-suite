<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UsageLog
 *
 * @property int $id
 * @property string $tool_name
 * @property string $user_ip
 * @property array|null $parameters
 * @property array|null $result
 * @property int|null $execution_time_ms
 * @property string $status
 * @property string|null $error_message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereErrorMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereExecutionTimeMs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereResult($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereToolName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageLog whereUserIp($value)
 * @method static \Database\Factories\UsageLogFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class UsageLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tool_name',
        'user_ip',
        'parameters',
        'result',
        'execution_time_ms',
        'status',
        'error_message',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'parameters' => 'array',
        'result' => 'array',
        'execution_time_ms' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'usage_logs';
}