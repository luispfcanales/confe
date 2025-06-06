//--------------------------------------------------------------------

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Power, 
  PowerOff,
  Mail,
  IdCard,
  Calendar,
  Building
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { User } from "./users/types"
import { Role } from "./roles/types"

// Función helper para obtener las iniciales del usuario
const getUserInitials = (user: User) => {
  const first = user.first_name?.[0]?.toUpperCase() || ''
  const last = user.last_name?.[0]?.toUpperCase() || ''
  return first + last || 'US'
}

// Función helper para formatear fechas
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'N/A'
  }
}

// Función helper para obtener el label del sexo
const getSexLabel = (sex: number): string => {
  switch (sex) {
    case 1: return 'M'
    case 2: return 'F'
    case 3: return 'O'
    default: return 'N/A'
  }
}

export function createColumns<TData extends User | Role>(
  type: 'role' | 'user' | 'payment', 
  onEdit?: (row: TData) => void,
  onDelete?: (row: TData) => void,
  onToggleStatus?: (row: TData) => void,
  onViewDetails?: (row: TData) => void
): ColumnDef<TData>[] {
  const baseColumns: ColumnDef<TData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }
  ]

  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {onViewDetails && (
              <DropdownMenuItem
                onClick={() => onViewDetails(row.original)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
            )}
            
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(row.original)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}
            
            {onToggleStatus && (
              <DropdownMenuItem
                onClick={() => onToggleStatus(row.original)}
                className="cursor-pointer"
              >
                {(row.original as any).IsActive || (row.original as any).status === 'Activo' ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    Activar
                  </>
                )}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }

  if (type === 'role') {
    return [
      ...baseColumns,
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Nombre del Rol</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {(row.getValue("name") as string).charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.getValue("name")}</div>
              <div className="text-sm text-gray-500">Rol del sistema</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div className="text-center">
            <span className="font-semibold">Estado</span>
          </div>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status")
          const isActive = typeof status === 'boolean' ? status : status === 'Activo'
          
          return (
            <div className="flex justify-center">
              <Badge 
                variant={isActive ? "default" : "secondary"}
                className={`
                  ${isActive 
                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                    : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                  } 
                  font-medium px-3 py-1
                `}
              >
                {isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          )
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <span className="font-semibold">Descripción</span>
        ),
        cell: ({ row }) => {
          const description = row.getValue("description") as string
          return (
            <div className="max-w-xs">
              <p className="text-sm text-gray-700 truncate" title={description}>
                {description || "Sin descripción"}
              </p>
            </div>
          )
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <div className="text-center">
            <span className="font-semibold">Fecha Creación</span>
          </div>
        ),
        cell: ({ row }) => {
          const date = row.getValue("created_at")
          return (
            <div className="text-center text-sm">
              {date ? (
                <>
                  <div className="font-medium text-gray-900">
                    {formatDate(date as string).split(',')[0]}
                  </div>
                  <div className="text-gray-500">
                    {formatDate(date as string).split(',')[1]}
                  </div>
                </>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          )
        }
      },
      {
        accessorKey: "updated_at",
        header: ({ column }) => (
          <div className="text-center">
            <span className="font-semibold">Última Actualización</span>
          </div>
        ),
        cell: ({ row }) => {
          const date = row.getValue("updated_at")
          return (
            <div className="text-center text-sm">
              {date ? (
                <>
                  <div className="font-medium text-gray-900">
                    {formatDate(date as string).split(',')[0]}
                  </div>
                  <div className="text-gray-500">
                    {formatDate(date as string).split(',')[1]}
                  </div>
                </>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          )
        }
      },
      actionColumn
    ] as ColumnDef<TData>[]
  }

  if (type === 'user') {
    return [
      ...baseColumns,
      {
        accessorKey: "first_name",
        header: "Usuario",
        cell: ({ row }) => {
          const user = row.original as any
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {user.first_name} {user.last_name} {/* Corregido: usar user.first_name en lugar de user.FirstName */}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email} {/* Corregido: usar user.email en lugar de user.Email */}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "identity_document", // Cambiado de IdentityDocument a identity_document
        header: "Documento",
        cell: ({ row }) => {
          const user = row.original as any
          return (
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="font-mono text-sm">
                  {user.identity_document} {/* Cambiado de IdentityDocument */}
                </span>
                <span className="text-xs text-gray-500">
                  {user.document_type?.name || 'N/A'} {/* Acceso seguro a propiedad anidada */}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "role_id",
        header: "Rol",
        cell: ({ row }) => {
          const user = row.original as User; // Usa la interfaz User en lugar de 'any'
          return (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {user.role?.name || 'Sin rol'}
            </Badge>
          )
        },
      },

      {
        accessorKey: "is_internal", // Cambiado de IsInternal
        header: "Tipo",
        cell: ({ row }) => {
          const user = row.original as any
          return (
            <div className="flex flex-col gap-1">
              <Badge 
                variant={user.is_internal ? "default" : "secondary"} // Cambiado de IsInternal
                className={user.is_internal ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
              >
                <Building className="h-3 w-3 mr-1" />
                {user.is_internal ? 'Interno' : 'Externo'}
              </Badge>
              <span className="text-xs text-gray-500">
                Sexo: {getSexLabel(user.sex)} {/* Cambiado de Sex a sex */}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "is_active", // Cambiado de IsActive
        header: "Estado",
        cell: ({ row }) => {
          const user = row.original as any
          return (
            <Badge 
              variant={user.is_active ? "default" : "destructive"} // Cambiado de IsActive
              className={user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
            >
              {user.is_active ? ( // Cambiado de IsActive
                <>
                  <Power className="h-3 w-3 mr-1" />
                  Activo
                </>
              ) : (
                <>
                  <PowerOff className="h-3 w-3 mr-1" />
                  Inactivo
                </>
              )}
            </Badge>
          )
        },
      },
      {
        accessorKey: "created_at", // Mantener consistencia con snake_case
        header: "Fechas",
        cell: ({ row }) => {
          const user = row.original as any
          return (
            <div className="flex flex-col text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Creado:</span>
              </div>
              <span className="font-mono">
                {formatDate(user.created_at)} {/* Cambiado de CreatedAt */}
              </span>
              {user.updated_at && user.created_at !== user.updated_at && ( // Cambiado de UpdatedAt
                <>
                  <span className="mt-1">Actualizado:</span>
                  <span className="font-mono">
                    {formatDate(user.updated_at)} {/* Cambiado de UpdatedAt */}
                  </span>
                </>
              )}
            </div>
          )
        },
      },
      actionColumn
    ] as ColumnDef<TData>[]
  }

  // Fallback para otros tipos (payment)
  return [
    ...baseColumns,
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status")
        const isActive = typeof status === 'boolean' ? status : status === 'Activo'
        
        return (
          <div className="flex justify-center">
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className={`
                ${isActive 
                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                  : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                } 
                font-medium px-3 py-1
              `}
            >
              {isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        )
      },
    },
    actionColumn
  ] as ColumnDef<TData>[]
}


//===========================================

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
// import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"

// export function createColumns<TData extends { ID: string }>(
//   type: 'role' | 'payment', 
//   onEdit?: (row: TData) => void,
//   onDelete?: (row: TData) => void
// ): ColumnDef<TData>[] {
//   const baseColumns: ColumnDef<TData>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//           className="translate-y-[2px]"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//           className="translate-y-[2px]"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     }
//   ]

//   const actionColumn: ColumnDef<TData> = {
//     id: "actions",
//     header: () => <div className="text-center">Acciones</div>,
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className="h-8 w-8 p-0 hover:bg-gray-100"
//             >
//               <span className="sr-only">Abrir menú</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-48">
//             <DropdownMenuItem
//               onClick={() => onEdit?.(row.original)}
//               className="cursor-pointer"
//             >
//               <Edit className="mr-2 h-4 w-4" />
//               Editar
//             </DropdownMenuItem>
//             <DropdownMenuItem className="cursor-pointer">
//               <Eye className="mr-2 h-4 w-4" />
//               Ver detalles
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               onClick={() => onDelete?.(row.original)}
//               className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
//             >
//               <Trash2 className="mr-2 h-4 w-4" />
//               Eliminar
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     ),
//   }

//   if (type === 'role') {
//     return [
//       ...baseColumns,
//       {
//         accessorKey: "name",
//         header: ({ column }) => (
//           <div className="flex items-center space-x-2">
//             <span className="font-semibold">Nombre del Rol</span>
//           </div>
//         ),
//         cell: ({ row }) => (
//           <div className="flex items-center space-x-3">
//             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//               <span className="text-white font-semibold text-sm">
//                 {(row.getValue("name") as string).charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <div>
//               <div className="font-medium text-gray-900">{row.getValue("name")}</div>
//               <div className="text-sm text-gray-500">Rol del sistema</div>
//             </div>
//           </div>
//         ),
//       },
//       {
//         accessorKey: "status",
//         header: ({ column }) => (
//           <div className="text-center">
//             <span className="font-semibold">Estado</span>
//           </div>
//         ),
//         cell: ({ row }) => {
//           const status = row.getValue("status") as boolean;
//           return (
//             <div className="flex justify-center">
//               <Badge 
//                 variant={status ? "default" : "secondary"}
//                 className={`
//                   ${status 
//                     ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
//                     : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
//                   } 
//                   font-medium px-3 py-1
//                 `}
//               >
//                 {status ? "Activo" : "Inactivo"}
//               </Badge>
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "description",
//         header: ({ column }) => (
//           <span className="font-semibold">Descripción</span>
//         ),
//         cell: ({ row }) => {
//           const description = row.getValue("description") as string;
//           return (
//             <div className="max-w-xs">
//               <p className="text-sm text-gray-700 truncate" title={description}>
//                 {description || "Sin descripción"}
//               </p>
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "created_at",
//         header: ({ column }) => (
//           <div className="text-center">
//             <span className="font-semibold">Fecha Creación</span>
//           </div>
//         ),
//         cell: ({ row }) => {
//           const date = new Date(row.getValue("created_at"));
//           return (
//             <div className="text-center text-sm">
//               <div className="font-medium text-gray-900">
//                 {date.toLocaleDateString('es-ES', {
//                   day: '2-digit',
//                   month: '2-digit',
//                   year: 'numeric'
//                 })}
//               </div>
//               <div className="text-gray-500">
//                 {date.toLocaleTimeString('es-ES', {
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </div>
//             </div>
//           );
//         }
//       },
//       {
//         accessorKey: "updated_at",
//         header: ({ column }) => (
//           <div className="text-center">
//             <span className="font-semibold">Última Actualización</span>
//           </div>
//         ),
//         cell: ({ row }) => {
//           const date = new Date(row.getValue("updated_at"));
//           return (
//             <div className="text-center text-sm">
//               <div className="font-medium text-gray-900">
//                 {date.toLocaleDateString('es-ES', {
//                   day: '2-digit',
//                   month: '2-digit',
//                   year: 'numeric'
//                 })}
//               </div>
//               <div className="text-gray-500">
//                 {date.toLocaleTimeString('es-ES', {
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </div>
//             </div>
//           );
//         }
//       },
//       actionColumn
//     ] as ColumnDef<TData>[]
//   }

//   // Fallback para otros tipos
//   return [
//     ...baseColumns,
//     // {
//     //   accessorKey: "status",
//     //   header: "Status",
//     // },
//     actionColumn
//   ] as ColumnDef<TData>[]
// }




