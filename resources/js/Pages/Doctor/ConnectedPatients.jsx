import Layout from "@/Shared/Layout";
import { Head, usePage } from "@inertiajs/react";

const ConnectedPatient = () => {
    const {user} = usePage().props;

    return (
        <>
            <Head title="Connected Patients" />
            <h1 className="mb-8 text-3xl font-bold">Connected Patients</h1>
        </>
    );
};

ConnectedPatient.layout = (page) => <Layout children={page} />;

export default ConnectedPatient;
