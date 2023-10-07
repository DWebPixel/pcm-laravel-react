import { Link, useForm, Head, usePage } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import FileInput from "@/Shared/FileInput";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared//InputError";
import Checkbox from "@/Shared/Checkbox";

const Create = () => {
    const { roles } = usePage().props;
    console.log(roles);
    const { data, setData, errors, post, processing, reset} = useForm({
        role: "",
        access_type: "",
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
        post(route("patient.consent-settings.store"), {
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
                    Create Setting
                </h1>
            </div>
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form name="CreateForm" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="role" value="Select Role" />
                            <SelectInput
                                name="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData('role', e.target.value)
                                }
                            >
                                <option value="">Select Role</option>
                                { roles.map( role => <option value={role}>{role}</option>)}
                            </SelectInput>
                            <InputError message={errors.role} />
                        </div>
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="access_type" value="Select Access Type" />
                            <SelectInput
                                name="access_type"
                                value={data.access_type}
                                onChange={(e) =>
                                    setData('access_type', e.target.value)
                                }
                            >
                                <option value="">Select Access Type</option>
                                <option value="Read">Read</option>
                                <option value="Copy">Copy</option>
                                <option value="Write">Write</option>
                            </SelectInput>
                            <InputError message={errors.access_type} />
                        </div>
                        <div className="w-full pb-7 pr-6">
                            <InputLabel
                                forInput="purpose"
                                value="Select Purpose Type"
                            />
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
                    
                    </div>
                    <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            loading={processing}
                            type="submit"
                            className="btn-indigo"
                        >
                            Save Consent Settings
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </>
    );
};

Create.layout = (page) => <Layout title="Consent Settings" children={page} />;

export default Create;
