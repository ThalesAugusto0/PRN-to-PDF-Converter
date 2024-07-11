import './styles/global.css'

import { Button } from './components/ui/button'

export function App() {
  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100 flex">
      <div className="flex-1 flex flex-col max-h-screen">
        <main className="flex-1 flex items-center justify-center text-rotion-400">
          <Button variant="ghost">Selecione um arquivo</Button>
        </main>
      </div>
    </div>
  )
}
