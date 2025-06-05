import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Step3 from "./Step3";

const steps = [Step1, Step2, Step3];

export default function StudentStep({ userType, userData }: any) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        //step1
        info1: "",
        info2: "",
        // step2
        name: "",
        apPaterno: "",
        apMaterno: "",
        typeDocument: "",
        dni: "",
        email: "",
        telephone: "",
        orcid: "",
        investigatorType: "",

        //step3
        registro_renacyt: "",
        faculty: "",
        depa: "",
        carrerName: "",
        //step4
    });

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const StepComponent = steps[currentStep];

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return (
                    formData.info1 !== "" &&
                    formData.info2 !== ""
                );
            case 1:
                return (
                    formData.name.trim() !== "" &&
                    formData.apPaterno.trim() !== "" &&
                    formData.apMaterno.trim() !== "" &&
                    formData.typeDocument.trim() !== "" &&
                    formData.dni.trim().length >= 8 &&
                    formData.orcid.trim() !== "" &&
                    formData.email.includes("@") &&
                    formData.telephone.trim().length >= 6 &&
                    formData.investigatorType.trim()

                );
            case 2:
                return (
                    formData.registro_renacyt.trim() !== "" &&
                    formData.faculty.trim() !== "" &&
                    formData.depa.trim() !== "" &&
                    formData.carrerName.trim() !== ""
                );
            default:
                return false;
        }
    };


    const nextStep = () => {
        if (isStepValid()) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = () => {
        alert("enviando datos")
    }

    return (
        <div className="max-w-xl mx-auto p-4 border rounded-xl shadow space-y-4">

            {userData && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium">Datos encontrados:</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nombres</Label>
                            <Input value={userData.name} readOnly />
                        </div>
                        <div>
                            <Label>DNI</Label>
                            <Input value={userData.dni} readOnly />
                        </div>
                        <div>
                            <Label>Apellido Paterno</Label>
                            <Input value={userData.paternalSurname} readOnly />
                        </div>
                        <div>
                            <Label>Apellido Materno</Label>
                            <Input value={userData.maternalSurname} readOnly />
                        </div>
                        <div className="col-span-2">
                            <Label>Email Institucional</Label>
                            <Input value={userData.email} readOnly />
                        </div>
                        <div className="col-span-2">
                            <Label>{userType === 'student' ? 'Carrera' : 'Departamento'}</Label>
                            <Input
                                value={userType === 'student' ? userData.carrerName : userData.academicDepartament}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            )}

            <StepComponent
                formData={formData}
                updateField={updateField}
            />
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    Anterior
                </Button>
                <Button
                    onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                    disabled={!isStepValid()}
                >
                    {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                </Button>
            </div>
        </div>
    );
}
