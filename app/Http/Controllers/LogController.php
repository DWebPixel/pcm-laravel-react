<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PDF;

class LogController extends Controller
{
    // Generate PDF
    public function createPDF() {
        // retreive all records from db
        $data = auth()->user()->logs()->latest()->get()->toArray();
        
        // share data to view
        view()->share('logs',$data);
        view()->share('user',auth()->user());

        $pdf = PDF::loadView('pdf.logs');

        // download PDF file with download method
        return $pdf->download('reconciliation-logs-' . now()->format("Y-m-d") .  '.pdf');
    }
}
