"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { BsGraphUpArrow, BsPiggyBank, BsShieldCheck } from "react-icons/bs";
import { HiOutlineChartPie } from "react-icons/hi";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
      <div className="text-2xl text-primary/70 mt-0.5">{icon}</div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

interface StepProps {
  number: number;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
        {number}
      </div>
      <div className="pt-0.5">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export function Welcome() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/?tab=asset");
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto p-4">
      {/* Hero Section */}
      <div className="text-center space-y-3 py-6">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-geist-mono)]">
          Bienvenido a Fnlly
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Tu rastreador de finanzas minimalista. Simple, privado y directo al
          punto.
        </p>
      </div>

      {/* Features Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Por que Fnlly?</CardTitle>
          <CardDescription>
            Diseñado para ser simple y efectivo
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <FeatureCard
            icon={<BsGraphUpArrow />}
            title="Seguimiento de activos"
            description="Registra tus inversiones y observa su evolucion en el tiempo"
          />
          <FeatureCard
            icon={<HiOutlineChartPie />}
            title="Visualizacion clara"
            description="Graficos intuitivos para entender tu portafolio de un vistazo"
          />
          <FeatureCard
            icon={<BsPiggyBank />}
            title="Sin complicaciones"
            description="Interface minimalista sin distracciones ni funciones innecesarias"
          />
          <FeatureCard
            icon={<BsShieldCheck />}
            title="Tus datos, tu control"
            description="Informacion segura y privada, solo accesible por ti"
          />
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Como empezar</CardTitle>
          <CardDescription>Tres pasos simples</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Step
            number={1}
            title="Registra tu primer activo"
            description='Ve a "Asset" y agrega el nombre de tu inversion, cantidad y precio actual'
          />
          <Step
            number={2}
            title="Actualiza periodicamente"
            description="Cada vez que cambie el precio, registra una nueva entrada para el mismo activo"
          />
          <Step
            number={3}
            title="Visualiza tu progreso"
            description='En "Home" veras el valor total de tu portafolio y graficos de evolucion'
          />
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-medium">Tip</p>
              <p className="text-muted-foreground text-xs">
                Para marcar un activo como vendido, registralo con precio y
                cantidad en 0. Asi no aparecera en tu portafolio actual pero
                mantendras el historial.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex justify-center pb-4">
        <Button onClick={handleGetStarted} size="lg" className="px-8">
          Registrar mi primer activo
        </Button>
      </div>
    </div>
  );
}
