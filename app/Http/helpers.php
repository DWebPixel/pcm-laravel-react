<?php


if (! function_exists('addLog')) {
    function addLog($patient_id, $user_id, $org_id, $type = NULL, $message = NULL, $data = NULL) {
        return App\Models\Log::create([
            'patient_id' => $patient_id,
            'user_id' => $user_id,
            'organization_id' => $org_id,
            'type' => $type,
            'message' => $message,
            'data' => $data,
        ]);
    }
}