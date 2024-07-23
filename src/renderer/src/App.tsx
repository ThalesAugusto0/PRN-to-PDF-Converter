/* eslint-disable @typescript-eslint/no-unused-vars */
import './styles/global.css'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFormat, setSelectedFormat] = useState('pdf')

  async function handleSelectFile(): Promise<File | null> {
    return new Promise((resolve) => {
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
            const selectedFile = this.files[0]
            setSelectedFile(selectedFile)
            resolve(selectedFile)
            const reader = new FileReader()

            reader.addEventListener(
              'load',
              function () {
                fileInput.remove()
              },
              false,
            )

            reader.readAsDataURL(selectedFile)
          } else {
            resolve(null)
          }
        },
        false,
      )

      document.body.append(fileInput)
      fileInput.click()
    })
  }

  function handleRemoveFile() {
    setSelectedFile(null)
  }

  async function handleConvert(file: File) {
    const reader = new FileReader()

    reader.onload = async (event) => {
      const prnContent = event.target?.result as string

      try {
        // Cria um novo documento PDF
        const pdfDoc = await PDFDocument.create()
        let page = pdfDoc.addPage([612, 792])

        const { width, height } = page.getSize()
        const fontSize = 12
        const lineHeight = fontSize + 2
        let y = height - lineHeight

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const lines = prnContent.split('\n')

        for (const line of lines) {
          if (y < lineHeight) {
            page = pdfDoc.addPage([612, 792])
            y = height - lineHeight
          }
          page.drawText(line, {
            x: 50,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          })
          y -= lineHeight
        }

        // Salva o PDF em um Blob
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })

        // Cria um link para download do PDF
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = file.name.replace(/\.prn$/i, '.pdf')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error('Erro ao criar o PDF:', error)
      }
    }

    reader.onerror = (error) => {
      console.error('Erro ao ler o arquivo:', error)
    }

    reader.readAsText(file)
  }

  async function handleConvertFile() {
    if (selectedFile) {
      await handleConvert(selectedFile) // Chama a função de conversão apenas se um arquivo estiver selecionado
    } else {
      console.error('Nenhum arquivo foi selecionado.')
    }
  }

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
                {selectedFile?.name ? (
                  <>
                    <div className="flex items-center justify-center">
                      <Label
                        className="flex items-center justify-center h-[40px]"
                        htmlFor="text"
                      >
                        {selectedFile?.name}
                      </Label>
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
              {selectedFile?.name ? (
                <div>
                  <Select onValueChange={setSelectedFormat}>
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
              {selectedFile?.name ? (
                <div className="flex-1 flex justify-between">
                  <Button variant="destructive" onClick={handleRemoveFile}>
                    Cancelar
                  </Button>
                  <Button variant="default" onClick={handleConvertFile}>
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
