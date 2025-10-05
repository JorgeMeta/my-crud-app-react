import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (isEdit && id) {
      fetch(`http://localhost:3000/users/${id}`)
        .then((res) => res.json())
        .then((data: UserFormData) => {
          setValue("name", data.name);
          setValue("email", data.email);
        })
        .catch(console.error);
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEdit) {
        await fetch(`http://localhost:3000/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Usuário atualizado com sucesso!");
      } else {
        const res = await fetch("http://localhost:3000/users");
        const users = await res.json();
        const maxId =
          users.length > 0
            ? Math.max(...users.map((u: any) => Number(u.id)))
            : 0;
        const newUser = {
          ...data,
          id: maxId + 1,
        };
        await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        alert("Usuário criado com sucesso!");
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar usuário");
    }
  };

  return (
    <div className="mt-20 p-6 max-w-md mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isEdit ? "Editar Usuário" : "Criar Usuário"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nome</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
          {isEdit ? "Atualizar" : "Salvar"}
        </button>
      </form>
    </div>
  );
}
