import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { apiRequest } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const timeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
};

const AddServiceForm = forwardRef(({ onSaveSuccess }, ref) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const formRef = React.useRef();

    const handleCreateService = async (e) => {
        if(e) e.preventDefault();
        setSubmitting(true);
        setError('');

        const formData = new FormData(formRef.current);
        const duracaoEmTempo = formData.get('duracao');

        const serviceData = {
            nome: formData.get('nome'),
            descricao: formData.get('descricao'),
            duracao_minutos: timeToMinutes(duracaoEmTempo),
            preco: parseFloat(formData.get('preco')) || 0
        };

        if (!serviceData.nome || serviceData.duracao_minutos <= 0) {
            setError("Nome do serviço e duração são obrigatórios.");
            setSubmitting(false);
            return false;
        }

        try {
            await apiRequest.post('/servicos', serviceData);
            toast.success('Serviço adicionado com sucesso!');
            if (onSaveSuccess) onSaveSuccess();
            return true;
        } catch (err) {
            setError(err.message || 'Erro ao adicionar serviço.');
            toast.error(err.message || 'Erro ao adicionar serviço.');
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    useImperativeHandle(ref, () => ({
        save: handleCreateService
    }));

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Adicione seus Primeiros Serviços</h2>
                <p className="text-gray-600 mt-1">Cadastre os serviços que você oferece para que seus clientes possam agendá-los.</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form ref={formRef} onSubmit={handleCreateService} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="nome" className="mb-2 block">Nome do Serviço *</Label>
                        <Input id="nome" name="nome" required placeholder="Ex: Corte de Cabelo" />
                    </div>
                    <div>
                        <Label htmlFor="descricao" className="mb-2 block">Descrição</Label>
                        <Input id="descricao" name="descricao" placeholder="Opcional" />
                    </div>
                    <div>
                        <Label htmlFor="duracao" className="mb-2 block">Duração *</Label>
                        <Input
                            id="duracao"
                            name="duracao"
                            type="time"
                            required
                            defaultValue="00:30"
                            step="300"
                        />
                    </div>
                    <div>
                        <Label htmlFor="preco" className="mb-2 block">Preço (R$)</Label>
                        <Input id="preco" name="preco" type="number" step="0.01" min="0" placeholder="25.00" />
                    </div>
                </div>
                {/* The submit button is in the parent component */}
            </form>
        </div>
    );
});

export default AddServiceForm;
