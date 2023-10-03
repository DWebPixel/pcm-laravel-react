import { Link, usePage, Head, useForm } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Pagination from "@/Shared/Pagination";

const HealthRecords = () => {
    const { healthRecords } = usePage().props;
    const { data, links} = healthRecords;

    return (
        <>
            <Head title="Health Records" />
            <h1 className="mb-8 text-3xl font-bold">Health Records</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Organization</th>
                            <th className="px-6 pt-5 pb-4">Created By</th>
                            <th className="px-6 pt-5 pb-4">Role</th>
                            <th className="px-6 pt-5 pb-4">Diagnosis</th>
                            <th className="px-6 pt-5 pb-4">Record Date</th>
                            <th className="px-6 pt-5 pb-4">Prescription</th>
                            <th className="px-6 pt-5 pb-4">
                                Documents
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(
                            ({
                                id,
                                organization,
                                created_by,
                                role,
                                diagnosis,
                                prescription,
                                date_of_record,
                                purpose,
                            }) => (
                                <tr
                                    key={id}
                                    className="hover:bg-gray-100 focus-within:bg-gray-100"
                                >
                                    <td className="border-t px-6">
                                        {organization}
                                    </td>
                                    <td className="border-t px-6">
                                        {created_by}
                                    </td>
                                    <td className="border-t px-6">
                                        {role}
                                    </td>
                                    <td className="border-t px-6">
                                        {diagnosis}
                                    </td>
                                    <td className="border-t px-6">
                                        {date_of_record}
                                    </td>
                                    <td className="border-t px-6 max-w-[120px] whitespace-pre-wrap">
                                        {prescription}
                                    </td>
                                    <td className="border-t px-6">
                                    <div className="">
                                        <a href="" className="block text-indigo-500" >File 1</a>
                                        <a href="" className="block text-indigo-500" >File 2</a>
                                        <a href="" className="block text-indigo-500" >File 3</a>
                                    </div>
                                    </td>
                                </tr>
                            )
                        )}
                        {data.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="7">
                                    No health records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination links={links} />
        </>
    );
};

HealthRecords.layout = (page) => <Layout title="Health Records" children={page} />;

export default HealthRecords;
