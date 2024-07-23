/* eslint-disable @typescript-eslint/no-unused-vars */
import './styles/global.css'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useState } from 'react'
import { toast, Toaster } from 'sonner'

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
  const [selectedFormat, setSelectedFormat] = useState('')

  const monthMap: { [key: string]: string } = {
    JAN: 'Janeiro',
    FEV: 'Fevereiro',
    MAR: 'Março',
    ABR: 'Abril',
    MAI: 'Maio',
    JUN: 'Junho',
    JUL: 'Julho',
    AGO: 'Agosto',
    SET: 'Setembro',
    OUT: 'Outubro',
    NOV: 'Novembro',
    DEZ: 'Dezembro',
  }

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
    setSelectedFormat('')
  }

  async function handleConvert(file: File) {
    if (!selectedFormat) {
      toast.error('Selecione um formato de arquivo para continuar', {
        duration: 1500,
      })
      return
    }

    const reader = new FileReader()

    reader.onload = async (event) => {
      const prnContent = event.target?.result as string
      const lines = prnContent.split('\n')
      let nomeArquivo = file.name.replace(/\.prn$/i, '.pdf')

      for (const line of lines) {
        if (line.trim().startsWith('NOME : ')) {
          let nome = line.replace('NOME : ', '').trim()
          const parts = nome.split('.')
          if (parts.length > 1) {
            const mesAbreviado = parts[1].toUpperCase()
            const mesCompleto = monthMap[mesAbreviado] || mesAbreviado
            nome = parts[0]
            const date = new Date()
            const year = date.getFullYear()
            nomeArquivo = `${nome}_${mesCompleto}_${year}.pdf`
          } else {
            nomeArquivo = `${nome}_${new Date().getFullYear()}.pdf`
          }
          break
        }
      }

      try {
        const pdfDoc = await PDFDocument.create()
        let page = pdfDoc.addPage([612, 792])

        const { width, height } = page.getSize()
        const fontSize = 12
        const lineHeight = fontSize + 2
        let y = height - lineHeight

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

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

        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = nomeArquivo
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
    setSelectedFile(null)
    setSelectedFormat('')
  }

  async function handleConvertFile() {
    if (selectedFile) {
      await handleConvert(selectedFile)
    } else {
      console.error('Nenhum arquivo foi selecionado.')
    }
  }

  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100 flex">
      <div className="flex-1 flex flex-col max-h-screen">
        <main className="flex-1 flex items-center justify-center text-rotion-400">
          <Toaster position="top-center" richColors closeButton />
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
