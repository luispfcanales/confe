"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
//import {Role} from "./types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function createColumns<TData extends { ID: string }>(
  type: 'role' | 'payment', 
  onEdit?: (row: TData) => void,
  onDelete?: (row: TData) => void
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
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onEdit?.(row.original)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(row.original)}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
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
          const status = row.getValue("status") as boolean;
          return (
            <div className="flex justify-center">
              <Badge 
                variant={status ? "default" : "secondary"}
                className={`
                  ${status 
                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                    : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                  } 
                  font-medium px-3 py-1
                `}
              >
                {status ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <span className="font-semibold">Descripción</span>
        ),
        cell: ({ row }) => {
          const description = row.getValue("description") as string;
          return (
            <div className="max-w-xs">
              <p className="text-sm text-gray-700 truncate" title={description}>
                {description || "Sin descripción"}
              </p>
            </div>
          );
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
          const date = new Date(row.getValue("created_at"));
          return (
            <div className="text-center text-sm">
              <div className="font-medium text-gray-900">
                {date.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
              <div className="text-gray-500">
                {date.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          );
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
          const date = new Date(row.getValue("updated_at"));
          return (
            <div className="text-center text-sm">
              <div className="font-medium text-gray-900">
                {date.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
              <div className="text-gray-500">
                {date.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          );
        }
      },
      actionColumn
    ] as ColumnDef<TData>[]
  }

  // Fallback para otros tipos
  return [
    ...baseColumns,
    // {
    //   accessorKey: "status",
    //   header: "Status",
    // },
    actionColumn
  ] as ColumnDef<TData>[]
}