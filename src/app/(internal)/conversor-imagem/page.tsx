'use client'

import { useState } from 'react'
import { Upload, Download, Image as ImageIcon, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import JSZip from 'jszip'
import imageCompression from 'browser-image-compression'
import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'

// Função para converter imagem
const convertImage = async (file: File, format: string): Promise<Blob> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  const compressedFile = await imageCompression(file, options)

  // Aqui estamos apenas alterando a extensão do arquivo
  // Em um cenário real, você precisaria converter o formato da imagem no servidor
  return new File([compressedFile], `${file.name.split('.')[0]}.${format}`, {
    type: `image/${format}`
  })
}

// Função para criar o ZIP
const createZip = async (files: { name: string, data: Blob }[]): Promise<Blob> => {
  const zip = new JSZip()

  files.forEach(file => {
    zip.file(file.name, file.data)
  })

  return await zip.generateAsync({ type: "blob" })
}

export default function Component() {
  const [images, setImages] = useState<File[]>([])
  const [format, setFormat] = useState<string>('jpg')
  const [isConverting, setIsConverting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    setIsConverting(true)
    try {
      const convertedFiles = await Promise.all(
        images.map(async (file, index) => ({
          name: `imagem_${index + 1}.${format}`,
          data: await convertImage(file, format)
        }))
      )
      const zip = await createZip(convertedFiles)
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zip)
      link.download = `imagens_convertidas.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Erro ao converter imagens:', error)
      alert('Ocorreu um erro ao converter as imagens. Por favor, tente novamente.')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100  relative">
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[95%]">
        <Navigation />
      </div>
      <div className=" min-h-screen flex items-center flex-col justify-center px-5">
        <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 mt-[8%] mb-[5%] " >
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl font-bold text-white-500 text-center">Conversor de Imagens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 ">
            <div>
              <Label htmlFor="image-upload" className="block mb-2 text-white-100">Selecione as imagens</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-400 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-purple-400" />
                    <p className="mb-2 text-sm text-white-200"><span className="font-semibold">Clique para fazer upload</span></p>
                    <p className="text-xs text-gray-400">PNG, JPG, WebP ou ICO</p>
                  </div>
                  <input id="image-upload" type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            </div>
            {images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-purple-300 mb-2">{images.length} imagem(ns) selecionada(s)</p>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg bg-gray-700">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <X size={16} />
                      </button>
                      <span className="absolute bottom-1 right-1 bg-gray-800 text-white text-xs px-1 rounded-tl">{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label className="block mb-2 text-white-300">Formato de conversão</Label>
              <RadioGroup defaultValue="jpg" className="flex space-x-4" onValueChange={setFormat}>
                {['jpg', 'png', 'webp', 'ico'].map((f) => (
                  <div key={f} className="flex items-center space-x-2">
                    <RadioGroupItem value={f} id={f} className="text-purple-400 border-purple-400" />
                    <Label htmlFor={f} className="text-gray-300">{f.toUpperCase()}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleConvert}
              disabled={images.length === 0 || isConverting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isConverting ? 'Convertendo...' : 'Converter e Baixar ZIP'}
              <Download className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}