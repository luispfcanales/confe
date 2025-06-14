// // src/components/investigator/postulation/CoInvestigatorCard.tsx
// import { useState } from 'react';
// import { Search, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { CoInvestigator, CoInvestigatorFromAPI } from './types';
// import { API_URL } from '@/constants/api'
// import { isUserCollaborator } from './utils';

// interface CoInvestigatorCardProps {
//   eventID: string;
//   coInvestigator: CoInvestigator;
//   index: number;
//   onRemove: (index: number) => void;
//   onUpdate: (index: number, updatedData: Partial<CoInvestigator>) => void;
// }

// const baseUrl = `${API_URL}/api`;
// export const CoInvestigatorCard: React.FC<CoInvestigatorCardProps> = ({
//   eventID,
//   coInvestigator,
//   index,
//   onRemove,
//   onUpdate
// }) => {
//   const [dniInput, setDniInput] = useState(coInvestigator.dni);

//   const handleDniChange = (dni: string) => {
//     setDniInput(dni);
//     onUpdate(index, {
//       dni,
//       fullName: '',
//       email: '',
//       institution: '',
//       academicGrade: '',
//       investigatorType: '',
//       notFound: false
//     });
//   };

//   const searchCoInvestigatorByDNI = async () => {
//     if (!dniInput.trim()) return;
  
//     onUpdate(index, { isLoading: true, notFound: false });
  
//     try {
//       const response = await fetch(`${baseUrl}/users/dni/search/${dniInput}`);
      
//       if (response.ok) {
//         const apiResponse = await response.json();
//         const userData: CoInvestigatorFromAPI = apiResponse.data;
//         console.log('Datos del investigador:', userData);
        
//         // Usar await en lugar de .then()
//         const isCollab = await isUserCollaborator(userData.ID, eventID);
        
//         if (isCollab) {
//           onUpdate(index, {
//             id: userData.ID,
//             fullName: `${userData.first_name} ${userData.last_name}`,
//             email: userData.email,
//             institution: `${userData.investigator.academic_departament.name} - ${userData.investigator.academic_departament.faculty.name}`,
//             academicGrade: userData.investigator.academic_grade.name,
//             investigatorType: userData.investigator.investigator_type.name,
//             isLoading: false,
//             notFound: false
//           });
//           toast.success('Investigador encontrado');
//         } else {
//           // Manejar el caso cuando NO es colaborador
//           onUpdate(index, {
//             isLoading: false,
//             notFound: true,
//             fullName: '',
//             email: '',
//             institution: '',
//             academicGrade: '',
//             investigatorType: ''
//           });
//           toast.error('El investigador no está registrado como colaborador en este evento');
//         }
//       } else {
//         // Manejar cuando la respuesta no es OK (usuario no encontrado)
//         onUpdate(index, {
//           isLoading: false,
//           notFound: true,
//           fullName: '',
//           email: '',
//           institution: '',
//           academicGrade: '',
//           investigatorType: ''
//         });
//         toast.error('Investigador no encontrado');
//       }
//     } catch (error) {
//       console.error('Error buscando investigador:', error);
//       onUpdate(index, {
//         isLoading: false,
//         notFound: true,
//         fullName: '',
//         email: '',
//         institution: '',
//         academicGrade: '',
//         investigatorType: ''
//       });
//       toast.error('Error al buscar el investigador');
//     }
//   };

//   return (
//     <div className="border rounded-lg p-4 mb-4">
//       <div className="flex items-center justify-between mb-3">
//         <h4 className="font-medium">Co-investigador {index + 1}</h4>
//         <Button
//           type="button"
//           onClick={() => onRemove(index)}
//           className="bg-red-600 hover:bg-red-700 text-sm px-2 py-1"
//         >
//           Eliminar
//         </Button>
//       </div>

//       {/* Búsqueda por DNI */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           DNI del Co-investigador *
//         </label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Ingrese el DNI"
//             value={dniInput}
//             onChange={(e) => handleDniChange(e.target.value)}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <Button
//             type="button"
//             onClick={searchCoInvestigatorByDNI}
//             disabled={!dniInput.trim() || coInvestigator.isLoading}
//             className="bg-blue-600 hover:bg-blue-700 px-4"
//           >
//             {coInvestigator.isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Search className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Mostrar datos encontrados o mensaje de error */}
//       {coInvestigator.notFound && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-sm text-red-700">
//             No se encontró ningún investigador con el DNI: {coInvestigator.dni}
//           </p>
//         </div>
//       )}

//       {coInvestigator.fullName && !coInvestigator.notFound && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 border border-green-200 rounded-md p-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Nombre Completo
//             </label>
//             <p className="text-sm text-gray-900">{coInvestigator.fullName}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <p className="text-sm text-gray-900">{coInvestigator.email}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Grado Académico
//             </label>
//             <p className="text-sm text-gray-900">{coInvestigator.academicGrade}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Tipo de Investigador
//             </label>
//             <p className="text-sm text-gray-900">{coInvestigator.investigatorType}</p>
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Institución
//             </label>
//             <p className="text-sm text-gray-900">{coInvestigator.institution}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// src/components/investigator/postulation/CoInvestigatorCard.tsx
import { Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoInvestigator } from './types';

interface CoInvestigatorCardProps {
  eventID: string;
  coInvestigator: CoInvestigator;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedData: Partial<CoInvestigator>) => void;
  readOnly?: boolean; // Nueva prop para modo solo lectura
}

export const CoInvestigatorCard: React.FC<CoInvestigatorCardProps> = ({
  coInvestigator,
  index,
  onRemove,
  readOnly = false
}) => {
  // Si es modo solo lectura, mostrar solo la información
  if (readOnly) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Co-investigador {index + 1}
          </h4>
          <Button
            type="button"
            onClick={() => onRemove(index)}
            className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.dni}
            </div>
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.fullName}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grado Académico
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.academicGrade}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Investigador
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.investigatorType}
            </div>
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institución
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.institution}
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  // Versión original para casos donde no sea solo lectura
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Co-investigador {index + 1}</h4>
        <Button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-600 hover:bg-red-700 text-sm px-2 py-1"
        >
          Eliminar
        </Button>
      </div>

      {/* Mostrar datos encontrados */}
      {coInvestigator.fullName && !coInvestigator.notFound && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grado Académico
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.academicGrade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Investigador
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.investigatorType}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institución
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.institution}</p>
          </div>
        </div>
      )}
    </div>
  );
};