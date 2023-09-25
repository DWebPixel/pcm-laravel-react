import Layout from "@/Shared/Layout";
import { Head } from "@inertiajs/react";

const Dashboard = () => {
    return (
        <>
            <Head title="Dashboard" />
            <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
        </>
    );
};

Dashboard.layout = (page) => <Layout children={page} />;

export default Dashboard;
