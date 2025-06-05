import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Step3({ formData, updateField }: any) {
    console.log(formData)
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <p className="bg-gray-200 p-2 rounded-md font-bold mb-2">
                    II. Información del docente / investigador RENACYT
                </p>
            </div>

            <div>
                <Label className="font-semibold">2.1. Registro RENACYT (OPCIONAL)
                </Label>
                <Input
                    id="registro_renacyt"
                    value={formData.registro_renacyt}
                    onChange={(e) => updateField("registro_renacyt", e.target.value)}
                />
            </div>

            <div>
                <Label className="font-semibold">2.2. Facultad
                </Label>
                <Select
                    value={formData.faculty}
                    onValueChange={(value) => updateField("faculty", value)}
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

            <div>
                <Label className="font-semibold">2.3. Departamento Académico
                </Label>
                <Select
                    value={formData.depa}
                    onValueChange={(value) => updateField("depa", value)}
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

            <div>
                <Label className="font-semibold">2.4. Carrera profesional
                </Label>
                <Input
                    id="carrerName"
                    value={formData.carrerName}
                    onChange={(e) => updateField("carrerName", e.target.value)}
                />
            </div>
        </div>
    );
}
