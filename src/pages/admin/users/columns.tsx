"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

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

export function createColumns<TData extends { ID: string }>(type: 'role' | 'payment'): ColumnDef<TData>[] {
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
          <div>{row.getValue("Status") ? "Active" : "Inactive"}</div>
        ),
      },
      {
        accessorKey: "Description",
        header: "Description",
      },
      {
        accessorKey: "CreatedAt",
        header: "Created At",
      },
      {
        accessorKey: "UpdatedAt",
        header: "Updated At",
      }
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
