"use client"

import { FileIcon } from "@/components/ui/file-icon"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { ChatbotUIContext } from "@/context/context"
import { useContext, useState } from "react"

export default function SearchPage() {
  const { selectedWorkspace } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<
    {
      content: string
      file_description: string
      file_id: string
      file_name: string
      file_path: string
      file_size: number
      file_tokens: number
      file_type: string
      id: string
      similarity: number
      tokens: number
    }[]
  >([])

  const handleSearch = async () => {
    setLoading(true)

    const response = await fetch("/api/retrieval/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userInput: search,
        embeddingsProvider: selectedWorkspace?.embeddings_provider,
        sourceCount: 50
      })
    })

    const { results } = await response.json()

    console.log(results)

    setResults(results)

    setLoading(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSearch()
    }
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center p-10">
      {loading ? (
        <div className="animate-pulse">Searching files...</div>
      ) : (
        <>
          <TextareaAutosize
            className="text-md h-[60px] w-[500px] rounded-xl"
            value={search}
            onValueChange={setSearch}
            placeholder="Search your files..."
            minRows={2}
            onKeyDown={handleKeyPress}
          />

          {results.length > 0 && (
            <div className="mt-10 w-full space-y-10 overflow-auto">
              {results.map((result, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex space-x-2">
                    <div>{(result.similarity * 100).toFixed(1)}</div>
                    <FileIcon type={result.file_type} />
                    <div>{result.file_name}</div>
                  </div>

                  <div>{result.content}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
