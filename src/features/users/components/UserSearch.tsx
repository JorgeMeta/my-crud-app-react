import type { UserSerachProps } from "../models/UserSearch";

export default function UserSearch({
  search,
  onSearchChange,
}: UserSerachProps) {
  return (
    <input
      type="text"
      placeholder="Pesquisar por ID, nome ou email..."
      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}
