import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Plans = () => {
  const isTrial = true; // Simular período de teste

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Planos e Assinatura</h1>

      {/* Seção: Status da Assinatura Atual */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Status da Assinatura Atual</h2>
        <Card>
          <CardHeader>
            <CardTitle>{isTrial ? "Status da Conta: Período de Teste" : "Plano Bronze Ativo"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {isTrial
                ? "Você tem 7 dias de acesso gratuito a todos os recursos. Escolha um plano antes do fim do teste para não perder seu acesso."
                : "Sua assinatura renova em 24/10/2025."
              }
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="recurring-billing" disabled={isTrial} />
                <Label htmlFor="recurring-billing">Cobrança Recorrente</Label>
              </div>
              {!isTrial && (
                <button className="text-sm text-red-600 hover:text-red-800">
                  Cancelar Plano
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Seção: Planos Disponíveis */}
      <section>
        <h2 className="text-2xl font-semibold mb-8 text-center">Escolha o Plano Ideal para Você</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card Bronze */}
          <Card className="flex flex-col">
            <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-400 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Plano Bronze</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <p className="text-4xl font-bold mb-4">R$ 29,90<span className="text-lg font-normal">/mês</span></p>
              <ul className="space-y-2 text-gray-600">
                <li>Até 50 agendamentos/mês</li>
                <li>1 profissional</li>
                <li>Suporte via e-mail</li>
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700">Assinar</button>
            </div>
          </Card>

          {/* Card Prata */}
          <Card className="flex flex-col border-2 border-purple-600 relative">
            <div className="absolute -top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Mais Popular</div>
            <CardHeader className="bg-gradient-to-r from-gray-400 to-gray-200 text-gray-800 rounded-t-lg">
              <CardTitle className="text-2xl">Plano Prata</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <p className="text-4xl font-bold mb-4">R$ 59,90<span className="text-lg font-normal">/mês</span></p>
              <ul className="space-y-2 text-gray-600">
                <li>Agendamentos ilimitados</li>
                <li>Até 5 profissionais</li>
                <li>Relatórios básicos</li>
                <li>Suporte via chat</li>
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Assinar</button>
            </div>
          </Card>

          {/* Card Gold */}
          <Card className="flex flex-col">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-200 text-gray-800 rounded-t-lg">
              <CardTitle className="text-2xl">Plano Gold</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <p className="text-4xl font-bold mb-4">Customizado</p>
              <ul className="space-y-2 text-gray-600">
                <li>Tudo do plano Prata +</li>
                <li>Múltiplas filiais</li>
                <li>API para integrações</li>
                <li>Suporte dedicado por telefone</li>
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700">Entrar em contato</button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Plans;