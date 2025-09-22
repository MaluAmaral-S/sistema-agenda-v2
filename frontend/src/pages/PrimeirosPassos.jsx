import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OnboardingBusinessHours from '../components/onboarding/OnboardingBusinessHours';
import OnboardingServices from '../components/onboarding/OnboardingServices';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiRequest } from '../services/api';
import { Clock, Calendar, Building2, Check } from 'lucide-react';
import { toast } from 'sonner';

const PrimeirosPassos = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [businessHours, setBusinessHours] = useState({});
  const [businessData, setBusinessData] = useState({
    businessName: user?.businessName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
        setBusinessData({
            businessName: user.businessName || '',
            email: user.email || '',
            phone: user.phone || '',
        });
    }
  }, [user]);

  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate('/painel', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadBusinessHours = async () => {
      try {
        const response = await apiRequest.get('/business-hours');
        if (response && response.businessHours && Object.keys(response.businessHours).length > 0) {
          setBusinessHours(response.businessHours);
        } else {
          const defaultHours = {
            "1": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
            "2": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
            "3": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
            "4": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
            "5": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
          };
          setBusinessHours(defaultHours);
        }
      } catch (error) {
        console.warn('Erro ao carregar horários, usando padrão:', error.message);
      }
    };
    loadBusinessHours();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      setIsSaving(true);
      try {
        await apiRequest.post('/business-hours', { businessHours });
        toast.success('Horários salvos com sucesso!');
        setStep(2);
      } catch (error) {
        toast.error('Não foi possível salvar os horários. Tente novamente.');
      } finally {
        setIsSaving(false);
      }
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      await apiRequest.post('/onboarding/complete');
      await checkAuth(); // Refresh user state
      navigate('/painel');
    } catch (error) {
      console.error('Erro ao finalizar o onboarding:', error);
      toast.error('Não foi possível finalizar a configuração.');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await apiRequest.patch('/profile', businessData);
      toast.success('Dados da empresa salvos com sucesso!');
      await completeOnboarding();
    } catch (error) {
      toast.error('Não foi possível salvar os dados da empresa.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p className="mb-4 text-gray-600 text-center">Defina aqui os dias e horários em que você está disponível para receber agendamentos. <br /> Seus clientes só conseguirão marcar horários dentro dos intervalos que você selecionar.</p>
            <OnboardingBusinessHours businessHours={businessHours} setBusinessHours={setBusinessHours} />
          </div>
        );
      case 2:
        return (
            <div>
                <p className="mb-4 text-gray-600">Adicione os serviços que você oferece. A 'duração' é muito importante, pois nosso sistema a usará para evitar que clientes marquem horários conflitantes.</p>
                <OnboardingServices />
            </div>
        );
      case 3:
        return (
            <div>
                <p className="mb-4 text-gray-600">Revise os dados do seu negócio. O 'Nome da Empresa' será exibido para seus clientes na página de agendamento. O e-mail e o WhatsApp serão usados para comunicação.</p>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="businessName" className="mb-2 block">Nome da Empresa</Label>
                        <Input id="businessName" value={businessData.businessName} onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})} />
                    </div>
                    <div>
                        <Label htmlFor="email" className="mb-2 block">E-mail de Contato</Label>
                        <Input id="email" type="email" value={businessData.email} onChange={(e) => setBusinessData({...businessData, email: e.target.value})} />
                    </div>
                    <div>
                        <Label htmlFor="whatsapp" className="mb-2 block">Número de WhatsApp</Label>
                        <Input id="whatsapp" type="tel" value={businessData.phone} onChange={(e) => setBusinessData({...businessData, phone: e.target.value})} />
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-white text-center">Configuração Inicial da Conta</h1>
        </div>
      </header>

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-center items-center">
            {[
              { step: 1, icon: <Clock className="w-5 h-5" />, label: 'Horários' },
              { step: 2, icon: <Calendar className="w-5 h-5" />, label: 'Serviços' },
              { step: 3, icon: <Building2 className="w-5 h-5" />, label: 'Sua Empresa' }
            ].map(({ step: s, icon, label }) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    step === s ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-110 shadow-lg' :
                    step > s ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                    'bg-gray-200 text-gray-500'
                    }`}>
                    {step > s ? <Check className="w-6 h-6" /> : icon}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${step === s ? 'text-purple-600' : 'text-gray-500'}`}>{label}</p>
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Bem-vindo(a), {user?.name || 'Empreendedor(a)'}!</h2>
          <p className="text-lg text-gray-600 mt-2">Vamos configurar sua conta. Siga os passos para deixar tudo pronto para seus clientes.</p>
        </div>

        <Card className="w-full">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-12">
          <div>
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                    Pular e ir para o Painel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você pode concluir as configurações mais tarde no seu painel.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSkip}>Pular</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div>
            {step < 3 && (
              <Button onClick={handleNext} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                {isSaving ? "Salvando..." : "Próximo"}
              </Button>
            )}
            {step === 3 && (
              <Button onClick={handleFinish} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                {isSaving ? "Salvando..." : "Finalizar e ir para o Painel"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrimeirosPassos;
