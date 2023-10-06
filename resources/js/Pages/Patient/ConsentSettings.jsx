import { Link, useForm, Head } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import FileInput from "@/Shared/FileInput";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared//InputError";
import Checkbox from "@/Shared/Checkbox";

const ConsentSettings = () => {
    const { data, setData, errors, post, processing, reset} = useForm({
        roles: {
            "Nurse": "None",
            "Doctor": "None",
            "Sales Agent": "None",
            "Medical Representative": "None",
        },
        purpose: {
            "GeneralPurpose": false,
            "Education": false,
            "E-Statistic": false,
            "E-MedicineDiscovery": false,
            "MedicalTreatment": false,
            "M-Cancer": false,
            "M-Diabetic": false,
            "M-Education": false,
            "M-Mental": false,
            "Insurance": false,
            "I-EvaluatelnsuranceStatus": false
            },  
        },
    );

    function handleSubmit(e) {
        e.preventDefault();
        post(route("patient.store-consent-settings"), {
            onSuccess: () => {
                reset();
            },
        });
    }

    const handleSelectChange = (role, access) => {
        setData("roles", {
            ...data["roles"],
            [role]: access,
          });
    }

    const handleCheckboxChange = (type) => {
        const currentState = data['purpose'][type];
        setData("purpose", {
          ...data["purpose"],
          [type]: !currentState,
        });

        if( type == 'GeneralPurpose' ) {
            setData("purpose", {
                "GeneralPurpose": !currentState,
                "Education": !currentState,
                "E-Statistic": !currentState,
                "E-MedicineDiscovery": !currentState,
                "MedicalTreatment": !currentState,
                "M-Cancer": !currentState,
                "M-Diabetic": !currentState,
                "M-Education": !currentState,
                "M-Mental": !currentState,
                "Insurance": !currentState,
                "I-EvaluatelnsuranceStatus": !currentState
            });
        }

        if( type == 'Education' ) {
            setData("purpose", {
                ...data["purpose"],
                "Education": !currentState,
                "E-Statistic": !currentState,
                "E-MedicineDiscovery": !currentState,
            });
        }

        if( type == 'MedicalTreatment' ) {
            setData("purpose", {
                ...data["purpose"],
                "MedicalTreatment": !currentState,
                "M-Cancer": !currentState,
                "M-Diabetic": !currentState,
                "M-Education": !currentState,
                "M-Mental": !currentState,
            });
        }

        if( type == 'Insurance' ) {
            setData("purpose", {
                ...data["purpose"],
                "Insurance": !currentState,
                "I-EvaluatelnsuranceStatus": !currentState,
            });
        }

      };

    return (
        <>
            <Head title="Consent Settings" />
            <div>
                <h1 className="mb-8 text-3xl font-bold">
                    Automatic Consent Settings
                </h1>
            </div>
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form name="ConsentSettingsForm" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <div className="w-full pb-2 pr-6 text-lg font-semibold">Select generic permissions</div>            
                        <div className="w-full pb-7 pr-6">
                            <Checkbox
                                name="general_purpose"
                                value={data.purpose.GeneralPurpose}
                                handleChange={(e) =>
                                    handleCheckboxChange('GeneralPurpose')
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                General Purpose
                            </span>
                            <div className="ml-10">
                                <div>
                                    <div>
                                        <Checkbox
                                            name="education"
                                            value={data.purpose.Education}
                                            handleChange={(e) =>
                                                handleCheckboxChange('Education')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Education
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="e-statistic"
                                                value={data.purpose['E-Statistic']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('E-Statistic')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            E-Statistic
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="e-MedicineDiscovery"
                                                value={data.purpose['E-MedicineDiscovery']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('E-MedicineDiscovery')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            E-MedicineDiscovery
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Checkbox
                                            name="medicaltreatment"
                                            value={data.purpose.MedicalTreatment}
                                            handleChange={(e) =>
                                                handleCheckboxChange('MedicalTreatment')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                        MedicalTreatment
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="m-cancer"
                                                value={data.purpose['M-Cancer']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Cancer')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Cancer
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-diabetic"
                                                value={data.purpose['M-Diabetic']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Diabetic')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Diabetic
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-education"
                                                value={data.purpose['M-Education']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Education')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Education
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-mental"
                                                value={data.purpose['M-Mental']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Mental')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Mental
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <Checkbox
                                            name="insurance"
                                            value={data.purpose.Insurance}
                                            handleChange={(e) =>
                                                handleCheckboxChange('Insurance')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Insurance
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="i-evaluatelnsurancestatus"
                                                value={data.purpose['I-EvaluatelnsuranceStatus']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('I-EvaluatelnsuranceStatus')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            I-EvaluatelnsuranceStatus
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <InputError message={errors.purpose} />
                        </div>
                        <div className="w-full pb-2 pr-6 text-lg font-semibold">Select Access Type for Roles</div>                    
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="nurse_access_type" value="Nurse" />
                            <SelectInput
                                name="nurse_access_type"
                                value={data.roles.Nurse}
                                onChange={(e) =>
                                    handleSelectChange('Nurse', e.target.value)
                                }
                            >
                                <option value="None">None</option>
                                <option value="Read">Read</option>
                                <option value="Copy">Copy</option>
                                <option value="Write">Write</option>
                            </SelectInput>
                        </div>

                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="doctor_access_type" value="Doctor" />
                            <SelectInput
                                name="doctor_access_type"
                                value={data.roles.Doctor}
                                onChange={(e) =>
                                    handleSelectChange('Doctor', e.target.value)
                                }
                            >
                                 <option value="None">None</option>
                                <option value="Read">Read</option>
                                <option value="Copy">Copy</option>
                                <option value="Write">Write</option>
                            </SelectInput>
                        </div>

                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="sales_access_type" value="Sales Agent" />
                            <SelectInput
                                name="sales_access_type"
                                value={data.roles["Sales Agent"]}
                                onChange={(e) =>
                                    handleSelectChange('Sales Agent', e.target.value)
                                }
                            >
                                 <option value="None">None</option>
                                <option value="Read">Read</option>
                                <option value="Copy">Copy</option>
                                <option value="Write">Write</option>
                            </SelectInput>
                        </div>

                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="medical_access_type" value="Medical Representative" />
                            <SelectInput
                                name="medical_access_type"
                                value={data.roles["Medical Representative"]}
                                onChange={(e) =>
                                    handleSelectChange('Medical Representative', e.target.value)
                                }
                            >
                                 <option value="None">None</option>
                                <option value="Read">Read</option>
                                <option value="Copy">Copy</option>
                                <option value="Write">Write</option>
                            </SelectInput>
                        </div>
                        
                    </div>
                    <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            loading={processing}
                            type="submit"
                            className="btn-indigo"
                        >
                            Consent Settings
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </>
    );
};

ConsentSettings.layout = (page) => <Layout title="Consent Settings" children={page} />;

export default ConsentSettings;
