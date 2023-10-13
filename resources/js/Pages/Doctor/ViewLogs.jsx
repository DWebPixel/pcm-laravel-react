import { Link, usePage, Head, useForm } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Pagination from "@/Shared/Pagination";
import jsPDF from 'jspdf'
import { useRef } from 'react';

const ViewLogs = () => {
    const { logs } = usePage().props;
    const reportTemplateRef = useRef(null);

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
        } else if( type == 'auto_consent_grant') {
            return (
                <>
                <p><span className="font-medium">Access Type: </span> { data.consent.access_type }</p>    
                <p><span className="font-medium">Role: </span> { data.consent.role }</p>    
                <p><span className="font-medium">Purpose: </span> { data.consent.requested_purpose?.join() }</p>    
                </>
            )
        } else if( type == 'access_records') {
            return (
                <>
                <p><span className="font-medium">Access Type: </span> { data.access_type }</p>    
                <p><span className="font-medium">Role: </span> { data.role }</p>    
                <p><span className="font-medium">Purpose: </span> { data.requested_purpose?.join() }</p>    
                </>
            )
        } else if( type == 'access_records_denied') {
            return (
                <>
                <p><span className="font-medium">User: </span> { data.name }</p>    
                <p><span className="font-medium">Role: </span> { data.role }</p>    
                <p><span className="font-medium">Address: </span> { data.bc_address }</p>    
                </>
            )
        } else if( type == 'access_revoked') {
            return (
                <>
                <p><span className="font-medium">Access Type: </span> { data.access_type }</p>    
                <p><span className="font-medium">Role: </span> { data.role }</p>    
                <p><span className="font-medium">Only Once: </span> { data.only_once ? "Yes" : "No" }</p>    
                </>
            )
        }
    }

    const handleGeneratePdf = () => {
		const doc = new jsPDF({
			format: 'a4',
			unit: 'px',
		});

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});
	};

    return (
        <>
            <Head title="View Logs" />
            <div className="flex space-x-5">
            <h1 className="mb-8 text-3xl font-bold">Logs for Reconciliation</h1>
            <a href={route('download-logs')} target="_blank" className="px-6 py-3 rounded bg-indigo-600 text-white text-sm leading-4 font-bold whitespace-nowrap hover:bg-orange-400 focus:bg-orange-400 transition ease-in-out duration-150 inline-block mb-6">Download PDF</a>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow" ref={reportTemplateRef}>
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4 w-40 max-w-xl whitespace-normal">Date and Time</th>
                            <th className="px-6 pt-5 pb-4 w-96 max-w-xl">Log</th>
                            <th className="px-6 pt-5 pb-4 w-96 max-w-xl">Data</th>
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
                                    className="hover:bg-gray-100 focus-within:bg-gray-100 h-[50px] whitespace-normal"
                                >
                                    <td className="border-t px-6">
                                        {created_at}
                                    </td>
                                    <td className="border-t px-6 whitespace-normal">
                                        {message}
                                    </td>
                                    <td className="border-t px-6 py-2  whitespace-normal">
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
