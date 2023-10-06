import { Link, usePage, Head, useForm } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Icon from "@/Shared/Icon";
import Pagination from "@/Shared/Pagination";
import SearchFilter from "@/Shared/SearchFilter";
import AnchorLink from "@/Shared/AnchorLink";
import LoadingButton from "@/Shared/LoadingButton";
import DangerButton from "@/Shared/DangerButton";

const ConnectedPatients = () => {
    const { connectedPatients } = usePage().props;
    const { data, links } = connectedPatients;

    const { dataForm, setData, errors, post, processing } = useForm({
       
    });

    const revokeAccess = (id) => {
        post(route('patient.update-consent', [id, 'revoked']));
    }


    return (
        <>
            <Head title="Patients" />
            <h1 className="mb-8 text-3xl font-bold">Connected Patients</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Patient Name</th>
                            <th className="px-6 pt-5 pb-4">Bitcon Address</th>
                            <th className="px-6 pt-5 pb-4">Address</th>
                            <th className="px-6 pt-5 pb-4">Granted Access Type</th>
                            <th className="px-6 pt-5 pb-4">Granted Purpose</th>
                            <th className="px-6 pt-5 pb-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(
                            ({
                                id,
                                patient_id,
                                patient_name,
                                bc_address,
                                address,
                                granted_access_type,
                                granted_purpose,
                                requested_at,
                            }) => (
                                <tr
                                    key={id}
                                    className="hover:bg-gray-100 focus-within:bg-gray-100 h-[50px]"
                                >
                                    <td className="border-t px-6">
                                        {patient_name}
                                    </td>
                                    <td className="border-t px-6">
                                        {bc_address}
                                    </td>
                                    <td className="border-t px-6">
                                        {address}
                                    </td>
                                    <td className="border-t px-6">
                                        {granted_access_type}
                                    </td>
                                    <td className="border-t px-6">
                                        {granted_purpose.map((item, index) => <p key={index}>{item}</p>)}
                                    </td>
                                    <td className="border-t px-6">
                                    <div className="flex gap-2 items-center h-full">
                                        <AnchorLink
                                            className="focus:outline-none"
                                            style="btn"
                                            href={route("doctor.view-health-records", [patient_id, id])}
                                        >
                                            <span>View Records</span>
                                        </AnchorLink>
                                        { granted_access_type == 'Write' && <AnchorLink
                                            className="focus:outline-none"
                                            style="btn"
                                            href={route("doctor.create-health-record", [patient_id, id])}
                                        >
                                            <span>Add Record</span>
                                        </AnchorLink>
                                        }
                                    </div>
                                    </td>
                                </tr>
                            )
                        )}
                        {data.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="7">
                                    No connected patients found.
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

ConnectedPatients.layout = (page) => <Layout title="Connected Patients" children={page} />;

export default ConnectedPatients;
