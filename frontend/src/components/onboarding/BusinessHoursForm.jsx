import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Clock, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '../../services/api';
import { toast } from 'sonner';

const BusinessHoursForm = forwardRef(({ onSaveSuccess }, ref) => {
  const [businessHours, setBusinessHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const daysOfWeek = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  const defaultHours = {
    "0": { isOpen: false, intervals: [] },
    "1": { isOpen: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    "2": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
    "3": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
    "4": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
    "5": { isOpen: true, intervals: [{ start: '08:00', end: '18:00' }] },
    "6": { isOpen: true, intervals: [{ start: '09:00', end: '13:00' }] }
  };

  useEffect(() => {
    loadBusinessHours();
  }, []);

  const loadBusinessHours = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get('/business-hours');
      if (response && response.businessHours && Object.keys(response.businessHours).length > 0) {
        setBusinessHours(response.businessHours);
      } else {
        setBusinessHours(defaultHours);
      }
    } catch (error) {
      console.warn('Erro ao carregar horários, usando padrão:', error.message);
      setBusinessHours(defaultHours);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayIndex) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], isOpen: !prev[dayIndex]?.isOpen, intervals: prev[dayIndex]?.isOpen ? [] : prev[dayIndex]?.intervals || [] }
    }));
  };

  const addInterval = (dayIndex) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], intervals: [...(prev[dayIndex]?.intervals || []), { start: '09:00', end: '18:00' }] }
    }));
  };

  const removeInterval = (dayIndex, intervalIndex) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], intervals: prev[dayIndex]?.intervals?.filter((_, index) => index !== intervalIndex) || [] }
    }));
  };

  const updateInterval = (dayIndex, intervalIndex, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], intervals: prev[dayIndex]?.intervals?.map((interval, index) =>
          index === intervalIndex ? { ...interval, [field]: value } : interval
        ) || []
      }
    }));
  };

  const validateHours = () => {
    for (const dayIndex in businessHours) {
      const day = businessHours[dayIndex];
      if (day.isOpen) {
        for (const interval of day.intervals || []) {
          if (!interval.start || !interval.end) {
            setError(`No dia ${daysOfWeek[dayIndex]}, preencha todos os campos de horário.`);
            return false;
          }
          if (interval.start >= interval.end) {
            setError(`No dia ${daysOfWeek[dayIndex]}, o horário de término deve ser posterior ao de início.`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const saveBusinessHours = async () => {
    setError('');
    if (!validateHours()) {
      return false;
    }

    try {
      setSaving(true);
      await apiRequest.post('/business-hours', { businessHours });
      toast.success('Horários de funcionamento salvos!');
      if(onSaveSuccess) onSaveSuccess();
      return true;
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar horários.');
      setError(error.message || 'Erro ao salvar horários.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: saveBusinessHours
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Carregando horários...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Defina seus Horários de Funcionamento</h2>
            <p className="text-gray-600 mt-1">Informe aos seus clientes quando você está disponível para atendê-los.</p>
        </div>

        {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((dayName, dayIndex) => {
          const dayData = businessHours[dayIndex] || { isOpen: false, intervals: [] };
          const intervals = dayData.intervals || [];
          const isOpen = dayData.isOpen || false;

          return (
            <div key={dayIndex} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <span className="font-semibold text-md text-gray-800">{dayName}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isOpen} onChange={() => toggleDay(dayIndex)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {isOpen && (
                <div className="space-y-3 flex-grow">
                  {intervals.map((interval, intervalIndex) => (
                    <div key={intervalIndex} className="flex items-center gap-2">
                      <div className="flex-grow space-y-2">
                        <Input type="time" value={interval.start} onChange={(e) => updateInterval(dayIndex, intervalIndex, 'start', e.target.value)} />
                        <Input type="time" value={interval.end} onChange={(e) => updateInterval(dayIndex, intervalIndex, 'end', e.target.value)} />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeInterval(dayIndex, intervalIndex)} className="p-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addInterval(dayIndex)} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default BusinessHoursForm;
