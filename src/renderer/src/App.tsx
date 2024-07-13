import './styles/global.css'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from './components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card'
import { Label } from './components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'

export function App() {
  const [file, setFile] = useState<File>()

  function handleSelectFile() {
    const acceptList = ['.prn']

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = acceptList.join(',')
    fileInput.multiple = false
    fileInput.style.display = 'none'
    fileInput.addEventListener(
      'change',
      function () {
        if (this.files && this.files.length > 0) {
          setFile(this.files[0])
          const reader = new FileReader()

          reader.addEventListener(
            'load',
            function () {
              fileInput.remove()
            },
            false,
          )

          reader.readAsDataURL(this.files[0])
        }
      },
      false,
    )

    document.body.append(fileInput)
    fileInput.click()
  }

  function handleRemoveFile() {
    console.log('Item removido')
  }

  function handleConvert() {}

  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100 flex">
      <div className="flex-1 flex flex-col max-h-screen">
        <main className="flex-1 flex items-center justify-center text-rotion-400">
          <Card>
            <CardHeader>
              <CardTitle>Converta seu Arquivo</CardTitle>
              <CardDescription>Conversor de PRN para PDF.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pb-2">
                {file?.name ? (
                  <>
                    <div className="flex items-center justify-center">
                      <Label
                        className="flex items-center justify-center h-[40px]"
                        htmlFor="text"
                      >
                        {file?.name}
                      </Label>
                      <Button className="h-12 w-12" variant="ghost">
                        <Trash2 size={15} onClick={handleRemoveFile} />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    className="w-[300px]"
                    variant="ghost"
                    onClick={handleSelectFile}
                  >
                    Selecione um arquivo
                  </Button>
                )}
              </div>
              {file?.name ? (
                <div>
                  <Select>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Selecione o formato de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                ''
              )}
            </CardContent>
            <CardFooter>
              {file?.name ? (
                <div className="flex-1 flex justify-between">
                  <Button variant="destructive" onClick={handleRemoveFile}>
                    Cancelar
                  </Button>
                  <Button variant="default" onClick={handleConvert}>
                    Converter
                  </Button>
                </div>
              ) : (
                ''
              )}
            </CardFooter>
          </Card>
        </main>
        <p className="text-rotion-400 text-sm">Powered by Thales Augusto</p>
      </div>
    </div>
  )
}
