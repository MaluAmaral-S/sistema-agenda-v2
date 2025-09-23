import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Account = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...updateData } = formData;
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await apiRequest.patch("/auth/profile", updateData);

      setUser(prevUser => ({...prevUser, ...response.user}));

      toast.success("Informações da conta atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a conta:", error);
      toast.error("Erro ao atualizar a conta. Tente novamente.");
    } finally {
      setLoading(false);
      setFormData(prev => ({...prev, password: '', confirmPassword: ''}));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Gerenciamento da Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Responsável</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Nome da Empresa</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Nome do seu negócio"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
            <div className="border-t pt-6 space-y-6">
                 <p className="text-sm text-gray-600">
                    Deixe os campos de senha em branco para não a alterar.
                  </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
