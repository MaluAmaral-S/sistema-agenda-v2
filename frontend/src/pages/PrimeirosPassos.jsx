import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import BusinessHoursForm from '../components/onboarding/BusinessHoursForm';
import AddServiceForm from '../components/onboarding/AddServiceForm';
import { apiRequest } from '../services/api';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Clock,
  Briefcase,
  AlertTriangle,
  X,
} from 'lucide-react';

const PrimeirosPassos = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const businessHoursFormRef = useRef();
  const addServiceFormRef = useRef();

  useEffect(() => {
    // Se o usuário já completou o onboarding, redireciona para o painel
    if (user?.onboardingCompleted) {
      navigate('/painel', { replace: true });
    }
  }, [user, navigate]);

  const goToNextStep = async () => {
    if (currentStep === 2) {
      const success = await businessHoursFormRef.current.save();
      if (!success) return; // Don't advance if save fails
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const goToPreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const completeOnboarding = async () => {
    try {
      await apiRequest.post('/onboarding/complete');
    } catch (error) {
      console.error("Failed to mark onboarding as complete", error);
      // Even if this fails, we should probably still navigate away
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigate('/painel', { replace: true });
  };

  const handleFinish = async () => {
    const success = await addServiceFormRef.current.save();
    if (success) {
      await completeOnboarding();
      navigate('/painel', { replace: true });
    }
  };

  const steps = [
    { step: 1, label: 'Boas-vindas', icon: <LayoutGrid className="w-5 h-5" /> },
    { step: 2, label: 'Horários', icon: <Clock className="w-5 h-5" /> },
    { step: 3, label: 'Serviços', icon: <Briefcase className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <main className="max-w-4xl w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((item, index) => (
                <React.Fragment key={item.step}>
                    <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg ${currentStep === item.step ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg" : currentStep > item.step ? "bg-gradient-to-r from-green-500 to-green-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                        {currentStep > item.step ? <Check className="w-6 h-6" /> : item.step}
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-sm font-medium text-gray-400">Passo {item.step}</div>
                        <div className="text-lg font-semibold text-gray-800">{item.label}</div>
                    </div>
                    </div>
                    {index < steps.length - 1 && (<div className="flex-1 h-1 bg-gray-200 mx-4"><div className={`h-full transition-all duration-500 ${currentStep > item.step ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-200"}`}></div></div>)}
                </React.Fragment>
                ))}
            </div>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-xl shadow-lg border p-8 min-h-[400px]">
          {/* Content for each step will go here */}
          {currentStep === 1 && (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Olá, {user?.name || 'Empreendedor'}!
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Estamos felizes em ter você conosco. Siga os próximos passos para configurar sua plataforma.
              </p>
              <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border">
                <p className="text-gray-700">
                  As próximas etapas são essenciais para que seus clientes possam começar a agendar. Vamos:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
                  <li>
                    <strong>Definir seus horários de funcionamento:</strong> Para que todos saibam quando você está disponível.
                  </li>
                  <li>
                    <strong>Adicionar seus primeiros serviços:</strong> O que você oferece? Cadastre para que possam ser agendados.
                  </li>
                </ul>
                <p className="mt-6 text-sm text-gray-500">
                  Você pode pular esta etapa e configurar tudo depois, se preferir.
                </p>
              </div>
            </div>
          )}
          {currentStep === 2 && <BusinessHoursForm ref={businessHoursFormRef} />}
          {currentStep === 3 && <AddServiceForm ref={addServiceFormRef} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex-grow text-center">
            <Button variant="link" onClick={() => setShowSkipModal(true)}>
              Seguir direto para o painel
            </Button>
          </div>

          {currentStep < 3 ? (
            <Button onClick={goToNextStep} className="px-6 py-3 bg-purple-600 hover:bg-purple-700">
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="px-6 py-3 bg-green-600 hover:bg-green-700">
              Finalizar
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>

      {/* Skip Confirmation Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Você tem certeza?</h3>
                <p className="text-gray-600 mt-2">
                    Ao pular esta etapa, as configurações iniciais não serão salvas. Você poderá configurá-las manualmente no seu painel mais tarde.
                </p>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" onClick={() => setShowSkipModal(false)} className="w-full">
                Cancelar
              </Button>
              <Button onClick={handleSkip} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrimeirosPassos;
