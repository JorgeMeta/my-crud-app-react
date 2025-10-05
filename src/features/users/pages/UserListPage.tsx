import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import type { User } from "../models/User";
import { Link } from "react-router-dom";
import UserSearch from "../components/UserSearch";
import ConfirmModal from "../components/ConfirmModal";

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch(console.error);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search)
  );

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await fetch(`http://localhost:3000/users/${deleteUser.id}`);
      setUsers(users.filter((u) => u.id !== deleteUser.id));
      setIsModalOpen(false);
      setDeleteUser(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o usuário");
    }
  };

  return (
    <div className="p-6 relative overflow-x-auto shadow-lg sm:rounded-lg mt-6">
      <div className="flex justify-between items-center mb-4 px-6">
        <h1 className="text-3xl font-bold mb-4 px-6 text-center text-blue-400">
          Lista de Usuários
        </h1>
        <Link to="/users/new">
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition cursor-pointer">
            <PlusIcon className="h-5 w-5" />
          </button>
        </Link>
      </div>
      <div className="mb-4 px-6">
        <UserSearch search={search} onSearchChange={setSearch} />
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Nome
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {user.id}
              </td>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4 flex justify-center gap-2">
                <Link to={`/users/${user.id}/edit`}>
                  <button className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <PencilSquareIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setDeleteUser(user);
                    setIsModalOpen(true);
                  }}
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <ConfirmModal
          isOpen={isModalOpen}
          title="Confirmar Exclusão"
          message={
            deleteUser ? `Deseja realmente deletar ${deleteUser.name}?` : ""
          }
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
