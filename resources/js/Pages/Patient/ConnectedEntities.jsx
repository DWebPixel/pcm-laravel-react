import { Link, usePage, Head, useForm } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Icon from "@/Shared/Icon";
import Pagination from "@/Shared/Pagination";
import SearchFilter from "@/Shared/SearchFilter";
import AnchorLink from "@/Shared/AnchorLink";
import LoadingButton from "@/Shared/LoadingButton";
import DangerButton from "@/Shared/DangerButton";

const ConnectedEntities = () => {
    const { connectedEntities } = usePage().props;
    const { data, links } = connectedEntities;

    const { dataForm, setData, errors, post, processing } = useForm({
       
    });

    const revokeAccess = (id) => {
        post(route('patient.update-consent', [id, 'revoked']));
    }


    return (
        <>
            <Head title="Patients" />
            <h1 className="mb-8 text-3xl font-bold">Connected Entities</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Requestor Name</th>
                            <th className="px-6 pt-5 pb-4">Organization</th>
                            <th className="px-6 pt-5 pb-4">Role</th>
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
                                requestor_name,
                                organization,
                                role,
                                granted_access_type,
                                granted_purpose,
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
                                        {granted_access_type}
                                    </td>
                                    <td className="border-t px-6">
                                        {granted_purpose.map((item, index) => <p key={index}>{item}</p>)}
                                    </td>
                                    <td className="border-t px-6 flex gap-2 items-center h-full">
                                        {/* <LoadingButton
                                            onClick={() => grantPermission(id)}
                                            type="button"
                                            processing={processing}
                                        >
                                            Edit Access
                                        </LoadingButton> */}
                                        <DangerButton
                                            className="py-3 px-6"
                                            processing={processing}
                                            type="button"
                                            onClick={() => revokeAccess(id)}
                                        >
                                            Revoke Access
                                        </DangerButton>
                                    </td>
                                </tr>
                            )
                        )}
                        {data.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="7">
                                    No connected entities found.
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

ConnectedEntities.layout = (page) => <Layout title="Connected Doctors" children={page} />;

export default ConnectedEntities;
