import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Definición de tipos
type UserRole = 'investigador' | 'admin' | 'revisor';
type UserStatus = 'active' | 'inactive';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const UsersPage = () => {
  // Estado para la lista de usuarios
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active'
    }
  ]);

  // Estado para el nuevo usuario
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    role: 'investigador'
  });

  // Estado para el diálogo
  const [dialogOpen, setDialogOpen] = useState(false);

  // Manejadores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value: UserRole) => {
    setNewUser(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleCreateUser = () => {
    // Aquí iría la lógica para crear el usuario en el backend
    const newUserWithId: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active'
    };

    setUsers(prev => [...prev, newUserWithId]);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'investigador'
    });
    setDialogOpen(false);
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    }));
  };

  const deleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>Nombre</label>
                <Input
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <label>Email</label>
                <Input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <label>Contraseña</label>
                <Input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label>Rol</label>
                <Select
                  value={newUser.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="revisor">Revisor</SelectItem>
                    <SelectItem value="investigador">Investigador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleCreateUser}
              >
                Crear Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => console.log('Editar usuario:', user.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersPage;