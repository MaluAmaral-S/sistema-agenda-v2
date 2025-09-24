import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const MySubscription = () => {
  const isTrial = false; // Mude para true para ver o estado de teste

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {isTrial ? "Status da Conta: Período de Teste" : "Seu Plano Atual: Bronze"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isTrial
              ? "Você tem 7 dias de acesso gratuito a todos os recursos. Escolha um plano para não perder seu acesso."
              : "Sua assinatura será renovada em 24 de Outubro de 2025."}
          </p>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Switch id="recurring-billing" defaultChecked={!isTrial} disabled={isTrial} />
              <Label htmlFor="recurring-billing" className="font-medium">
                Cobrança Recorrente
              </Label>
            </div>
            {!isTrial && (
              <Button variant="destructive" size="sm">
                Cancelar Assinatura
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MySubscription;