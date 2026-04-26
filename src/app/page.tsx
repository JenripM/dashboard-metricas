import Dashboard from '@/components/Dashboard';

export const metadata = {
  title: 'Encuesta de Autoidentificación Étnica - Dashboard',
  description: 'Dashboard interactivo de la Encuesta de Autoidentificación Étnica con 288 respuestas universitarias.',
};

export default function Home() {
  return (
    <main>
      <Dashboard />
    </main>
  );
}
