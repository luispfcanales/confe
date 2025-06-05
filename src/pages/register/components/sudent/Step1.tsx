import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Step1({ formData, updateField }: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b pb-4">
        <p className="mb-4">Estoy de acuerdo con los criterios de elegibilidad, me someto voluntariamente al proceso de selección y acepto los resultados.</p>
        <RadioGroup
          defaultValue={formData.info1}
          onValueChange={(value) => updateField("info1", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="r1" />
            <Label htmlFor="r1">Si</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="r2" />
            <Label htmlFor="r2">No</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="border-b pb-4">
        <p className="mb-4">De resultar seleccionado, me comprometo a presentar el póster científico en modalidad presencial el día 25 de junio de 2024 durante el horario de 10:00 a 13:00 horas en el Anfiteatro Cultural de la UNAMAD.</p>
        <RadioGroup
          defaultValue={formData.info2}
          onValueChange={(value) => updateField("info2", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Si" id="r3" />
            <Label htmlFor="r3">Si</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="r4" />
            <Label htmlFor="r4">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
