"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export type Role = {
  ID: string
  Name: string
  Status: boolean
  Description: string
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
}

export type Payment = {
  ID: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export function createColumns<TData extends { ID: string }>(type: 'role' | 'payment', onEdit? : (row: TData) => void ): ColumnDef<TData>[] {
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    }
  ]
  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    header: "Opciones",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit?.(row.original)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </div>
    ),
  }

  if (type === 'role') {
    return [
      ...baseColumns,
      {
        accessorKey: "Name",
        header: "Nombre",
      },
      {
        accessorKey: "Status",
        header: "Estado",
        cell: ({ row }) => (
          <div>
            <span className={`px-2 py-1 rounded-md text-xs font-medium inline-block ${
              row.getValue("Status") 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {row.getValue("Status") ? "Active" : "Inactive"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "Description",
        header: "Description",
      },
      {
        accessorKey: "CreatedAt",
        header: "Fecha Creado",
        cell: ({ row }) => {
          const date = new Date(row.getValue("CreatedAt"));
          return <div>{date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</div>
        }
      },
      {
        accessorKey: "UpdatedAt",
        header: "Fecha Actualizado",
        cell: ({ row }) => {
          const date = new Date(row.getValue("UpdatedAt"));
          return <div>{date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</div>
        }
      },
      actionColumn
    ] as ColumnDef<TData>[]
  }

  return [
    ...baseColumns,
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    }
  ] as ColumnDef<TData>[]
}
