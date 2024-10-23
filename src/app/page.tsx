"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Download } from 'lucide-react'

export default function TextToSRTConverter() {
  const [inputText, setInputText] = useState('')
  const [charLimit, setCharLimit] = useState(32)
  const [srtOutput, setSRTOutput] = useState('')

  const convertToSRT = () => {
    const words = inputText.split(' ')
    let srt = ''
    let blockNumber = 1
    let currentBlock = ''
    let startTime = 0

    words.forEach((word, index) => {
      if ((currentBlock + word).length <= charLimit) {
        currentBlock += (currentBlock ? ' ' : '') + word
      } else {
        const endTime = startTime + 2 // Assume 2 seconds per block
        srt += `${blockNumber}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${currentBlock}\n\n`
        blockNumber++
        currentBlock = word
        startTime = endTime
      }

      if (index === words.length - 1) {
        const endTime = startTime + 2
        srt += `${blockNumber}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${currentBlock}\n\n`
      }
    })

    setSRTOutput(srt.trim())
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    return date.toISOString().substr(11, 12)
  }

  const downloadSRT = () => {
    const element = document.createElement("a")
    const file = new Blob([srtOutput], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = "subtitles.srt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-300">Text to SRT Converter</h1>
        <div className="space-y-6">
          <div>
            <label htmlFor="input-text" className="block text-sm font-medium mb-2">Input Text</label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-40 bg-gray-800 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>
          <div className="flex items-center  space-x-4">
            <div className="flex-1">
              <label htmlFor="char-limit" className="block text-sm font-medium mb-2">Character Limit per Block</label>

              <Input
                id="char-limit"
                type="number"
                value={charLimit}
                onChange={(e) => setCharLimit(parseInt(e.target.value))}
                className="w-full bg-gray-800 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="flex space-x-2 mt-7">

              <Button
                onClick={convertToSRT}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Convert
              </Button>
              <Button
                onClick={downloadSRT}
                disabled={!srtOutput}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5 mr-2" />
                Download SRT
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="srt-output" className="block text-sm font-medium mb-2">SRT Output</label>
            <Textarea
              id="srt-output"
              value={srtOutput}
              readOnly
              className="w-full h-60 bg-gray-800 border-gray-700"
            />
          </div>
          <footer className="text-gray-400 text-sm mt-7 text-center">
            <p>© 2024 <a href="https://www.stringweb.online/" target="_blank">Desenvovido por <strong>STRING WEB</strong> </a>All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}