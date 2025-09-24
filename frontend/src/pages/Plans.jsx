import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: "Bronze",
    price: "R$ 29,90",
    features: [
      "Até 50 agendamentos/mês",
      "1 profissional",
      "Suporte via e-mail",
    ],
    buttonText: "Assinar Agora",
    variant: "outline",
    Icon: Zap,
  },
  {
    name: "Prata",
    price: "R$ 59,90",
    features: [
      "Agendamentos ilimitados",
      "Até 5 profissionais",
      "Relatórios básicos",
      "Suporte via chat",
    ],
    buttonText: "Assinar Agora",
    variant: "default",
    Icon: Star,
    popular: true,
  },
  {
    name: "Gold",
    price: "Customizado",
    features: [
      "Tudo do plano Prata +",
      "Múltiplas filiais",
      "API para integrações",
      "Suporte dedicado por telefone",
    ],
    buttonText: "Entrar em Contato",
    variant: "outline",
    Icon: CheckCircle,
  },
];

const Plans = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
      <button onClick={() => navigate("/dashboard")} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para o Dashboard
        </button>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Planos flexíveis para o seu negócio
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Escolha o plano que melhor se adapta ao seu crescimento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-purple-600 border-2' : 'border-gray-200'}`}>
              {plan.popular && (
                <div className="absolute top-0 right-4 -mt-4">
                  <div className="bg-purple-600 text-white text-xs font-semibold py-1 px-3 rounded-full uppercase tracking-wider shadow-md">
                    Mais Popular
                  </div>
                </div>
              )}
              <CardHeader className="text-center">
                <plan.Icon className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between p-6">
                <div>
                  <p className="text-4xl font-extrabold text-center text-gray-900 mb-6">
                    {plan.price}
                    {plan.price.startsWith("R$") && <span className="text-lg font-medium text-gray-500">/mês</span>}
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full mt-8" variant={plan.variant} size="lg">
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;