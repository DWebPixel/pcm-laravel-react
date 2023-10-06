import { Link, usePage, Head, useForm } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Pagination from "@/Shared/Pagination";

const ViewLogs = () => {
    const { logs } = usePage().props;

    const showDataBasedOnType = function (type, data) {
        if( type == 'request_consent') {
            return (
                <>
                <p><span className="font-medium">Access Type: </span> { data.access_type }</p>    
                <p><span className="font-medium">Role: </span> { data.role }</p>    
                <p><span className="font-medium">Purpose: </span> { data.requested_purpose?.join() }</p>    
                </>
            )
        } else if( type == 'change_consent_status') {
            return (
                <>
                <p><span className="font-medium">Access Type: </span> { data.access_type }</p>    
                <p><span className="font-medium">Role: </span> { data.role }</p>    
                <p><span className="font-medium">Purpose: </span> { data.requested_purpose?.join() }</p>    
                </>
            )
        }
    }

    return (
        <>
            <Head title="View Logs" />
            <h1 className="mb-8 text-3xl font-bold">View Logs</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Date and Time</th>
                            <th className="px-6 pt-5 pb-4">Log</th>
                            <th className="px-6 pt-5 pb-4">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(
                            ({
                                id,
                                created_at,
                                message,
                                type,
                                data
                            }) => (
                                <tr
                                    key={id}
                                    className="hover:bg-gray-100 focus-within:bg-gray-100 h-[50px]"
                                >
                                    <td className="border-t px-6">
                                        {created_at}
                                    </td>
                                    <td className="border-t px-6">
                                        {message}
                                    </td>
                                    <td className="border-t px-6 py-2">
                                        { showDataBasedOnType(type, data) }
                                    </td>
                                </tr>
                            )
                        )}
                        {logs.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="3">
                                    No logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

ViewLogs.layout = (page) => <Layout title="View Logs" children={page} />;

export default ViewLogs;
