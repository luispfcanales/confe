import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Step2({ formData, updateField }: any) {
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <p className="bg-gray-200 p-2 rounded-md font-bold mb-2">
                    I. Sección de información del postulante (autor de correspondencia)
                </p>
                <p className="text-sm">
                    - Es responsabilidad del investigador consignar los datos correctamente para efectos de la certificación.
                </p>
            </div>

            <div>
                <Label className="font-semibold">1.1 Nombres</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">1.2. Apellido paterno</Label>
                <Input
                    id="apPaterno"
                    value={formData.apPaterno}
                    onChange={(e) => updateField("apPaterno", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">1.3. Apellido Materno</Label>
                <Input
                    id="apMaterno"
                    value={formData.apMaterno}
                    onChange={(e) => updateField("apMaterno", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">1.4. Tipo de documento</Label>
                <RadioGroup
                    value={formData.typeDocument}
                    onValueChange={(value) => updateField("typeDocument", value)}
                    className="mt-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DNI" id="r5" />
                        <Label htmlFor="r5">DNI (Documento Nacional de Identidad)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Carnet de extranjeria" id="r6" />
                        <Label htmlFor="r6">Carnet de extranjería</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="CPP" id="r7" />
                        <Label htmlFor="r7">CPP (Permiso Temporal de Permanencia)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Pasaporte" id="r8" />
                        <Label htmlFor="r8">Pasaporte</Label>
                    </div>
                </RadioGroup>
            </div>

            <div>
                <Label className="font-semibold">1.5. Documento de identidad</Label>
                <Input
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => updateField("dni", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">
                    1.6. Correo institucional UNAMAD o personal
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">1.7. Teléfono personal</Label>
                <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => updateField("telephone", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">
                    1.8. URL ORCID DOCENTE INVESTIGADOR
                    <span className="flex gap-1 mb-2">
                        p. ej.
                        <a
                            className="text-blue-600"
                            href="https://orcid.org/0000-0002-0861-6606"
                            target="__blank"
                        >
                            https://orcid.org/0000-0002-0861-6606
                        </a>
                    </span>
                </Label>
                <Input
                    id="orcid"
                    type="text"
                    value={formData.orcid}
                    onChange={(e) => updateField("orcid", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">1.9. Tipo de investigador</Label>
                <Select
                    value={formData.investigatorType}
                    onValueChange={(value) => updateField("investigatorType", value)}
                >
                    <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Renacyt">Renacyt</SelectItem>
                        <SelectItem value="Investigador ordinario">Investigador ordinario</SelectItem>
                        <SelectItem value="Docente investigador">Docente investigador</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
