import Layout from "@/Shared/Layout";
import { Head, usePage } from "@inertiajs/react";

const ConnectedDoctors = () => {
    const {user} = usePage().props;

    return (
        <>
            <Head title="Connected Patients" />
            <h1 className="mb-8 text-3xl font-bold">Connected Doctors</h1>
        </>
    );
};

ConnectedDoctors.layout = (page) => <Layout children={page} />;

export default ConnectedDoctors;
