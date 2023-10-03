import { Link, usePage, Head, useForm } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Icon from "@/Shared/Icon";
import Pagination from "@/Shared/Pagination";
import SearchFilter from "@/Shared/SearchFilter";
import AnchorLink from "@/Shared/AnchorLink";
import LoadingButton from "@/Shared/LoadingButton";
import DangerButton from "@/Shared/DangerButton";

const ConsentRequests = () => {
    const { requests } = usePage().props;
    const { data, links } = requests;

    const { dataForm, setData, errors, post, processing } = useForm({
       
    });

    const grantPermission = (id) => {
        post(route('patient.update-consent', [id, 'granted']));
    }

    const denyPermission = (id) => {
        post(route('patient.update-consent', [id, 'denied']))
    }

    return (
        <>
            <Head title="Patients" />
            <h1 className="mb-8 text-3xl font-bold">Consent Requests</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Requestor Name</th>
                            <th className="px-6 pt-5 pb-4">Organization</th>
                            <th className="px-6 pt-5 pb-4">Role</th>
                            <th className="px-6 pt-5 pb-4">Access Type</th>
                            <th className="px-6 pt-5 pb-4">Purpose</th>
                            <th className="px-6 pt-5 pb-4">Requested On</th>
                            <th className="px-6 pt-5 pb-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(
                            ({
                                id,
                                requestor_name,
                                organization,
                                role,
                                access_type,
                                purpose,
                                requested_at,
                            }) => (
                                <tr
                                    key={id}
                                    className="hover:bg-gray-100 focus-within:bg-gray-100"
                                >
                                    <td className="border-t px-6">
                                        {requestor_name}
                                    </td>
                                    <td className="border-t px-6">
                                        {organization}
                                    </td>
                                    <td className="border-t px-6">
                                        {role}
                                    </td>
                                    <td className="border-t px-6">
                                        {access_type}
                                    </td>
                                    <td className="border-t px-6">
                                        {purpose.map((item, index) => <p key={index}>{item}</p>)}
                                    </td>
                                    <td className="border-t px-6">
                                        {requested_at}
                                    </td>
                                    <td className="border-t px-6">
                                        <div className="flex gap-2 items-center h-full">
                                        <LoadingButton
                                            onClick={() => grantPermission(id)}
                                            type="button"
                                            processing={processing}
                                        >
                                            Grant
                                        </LoadingButton>
                                        <DangerButton
                                            className="py-3 px-6"
                                            processing={processing}
                                            type="button"
                                            onClick={() => denyPermission(id)}
                                        >
                                            Deny
                                        </DangerButton>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                        {data.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="7">
                                    No consent requests found.
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

ConsentRequests.layout = (page) => <Layout title="Consent Requests" children={page} />;

export default ConsentRequests;
