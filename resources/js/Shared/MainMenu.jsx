import React from "react";
import MainMenuItem from "@/Shared/MainMenuItem";
import { usePage } from "@inertiajs/react";

export default ({ className, onClick }) => {
    const { auth } = usePage().props;
    return (
        <div className={className} onClick={onClick}>
            {  auth.user.role == 'Admin' && 
                ( <>
                    <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
                    <MainMenuItem
                        text="Organizations"
                        link="organizations.index"
                        icon="office"
                    />
                    <MainMenuItem text="Users" link="users.index" icon="users" />
                    <MainMenuItem text="Patients" link="patients.index" icon="users" />
                    <MainMenuItem text="Reports" link="reports" icon="printer" />
                </>
                )
            }

            { auth.user.role != 'Patient' && auth.user.role != 'Admin' && 
                ( <>
                    <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
                    <MainMenuItem text="Received Consents" link="doctor.connected-patients" icon="users" />
                    <MainMenuItem text="Request Consent" link="doctor.request-consent" icon="location" />
                    <MainMenuItem text="Reconciliation" link="doctor.view-logs" icon="book" />
                    <MainMenuItem text="Pain Application" icon="printer" />
                </>
                )
            }

            { auth.user.role == 'Patient' && 
                ( <>
                    <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
                    <MainMenuItem text="Granted Consents" link="patient.connected-entities" icon="users" />
                    <MainMenuItem text="Consent Requests" link="patient.index-consents" icon="location" />
                    <MainMenuItem text="Health Records" link="patient.index-health-records" icon="printer" />
                    <MainMenuItem text="Consent Settings" link="patient.consent-settings.index" icon="office" />
                    <MainMenuItem text="Reconciliation" link="patient.view-logs" icon="book" />
                    <MainMenuItem text="Pain Application" icon="printer" />
                </>
                )
            }
        </div>
    );
};
