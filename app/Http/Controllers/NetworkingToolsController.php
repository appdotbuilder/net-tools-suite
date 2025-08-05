<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class NetworkingToolsController extends Controller
{

    /**
     * Display the networking tools dashboard.
     */
    public function index()
    {
        return Inertia::render('welcome');
    }
}