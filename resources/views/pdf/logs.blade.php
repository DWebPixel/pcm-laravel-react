<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Document</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }

        table, th, td {
            border: 1px solid black;
        }

        th, td {
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            white-space: normal;
        }

        td, p {
           white-space: normal;
        }
        
    </style>
</head>
<body>
    <div style="margin-bottom: 30px; ">
        <h2>Reconciliation logs for {{ $user->name }}</h2>
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }} </p>
    </div>
    <table>
        <tr>
            <th style="width: 140px;">Date</th>
            <th style="width: 200px;">Log</th>
            <th style="width: 280px;">Data</th>
        </tr>
        @foreach ( $logs as $log )
        <tr>
            <td>{{ $log['created_at'] }}</td>
            <td>{{ $log['message'] }}</td>
            <td style="width: 300px;">

            @if( $log['type'] == 'request_consent' || $log['type'] == 'change_consent_status' || $log['type'] == 'access_records')
                <p><span style="font-weight: medium">Access Type: </span> {{ $log['data']['access_type'] }}</p>    
                <p><span style="font-weight: medium">Role: </span>  {{ $log['data']['role'] }}</p>    
                <p><span style="font-weight: medium">Purpose: </span>  {{ implode(",", $log['data']['requested_purpose']) }}</p>
            @elseif( $log['type'] == 'auto_consent_grant')
                <p><span style="font-weight: medium">Access Type: </span> {{ $log['data']['consent']['access_type'] }}</p>    
                <p><span style="font-weight: medium">Role: </span>  {{ $log['data']['consent']['role'] }}</p>    
                <p><span style="font-weight: medium">Purpose: </span>  {{ implode(",", $log['data']['consent']['requested_purpose']) }}</p>
            @elseif( $log['type'] == 'access_records_denied')
                <p><span className="font-medium">User: </span> {{ $log['data']['name'] }}</p>    
                <p><span className="font-medium">Role: </span>  {{ $log['data']['role'] }}</p>    
                <p><span className="font-medium">Address: </span>  {{ $log['data']['bc_address'] }}</p>
            @elseif( $log['type'] == 'access_revoked')
                <p><span className="font-medium">Access Type: </span> {{ $log['data']['access_type'] }}</p>    
                <p><span className="font-medium">Role: </span>  {{ $log['data']['role'] }}</p>    
                <p><span className="font-medium">Only Once: </span>  {{ $log['data']['only_once'] ? "Yes" : "No" }}</p>
            @endif

            </td>
        </tr> 
        @endforeach
    </table>
</body>
</html>
