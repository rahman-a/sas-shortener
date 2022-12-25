import { useRef } from 'react'
import JoditEditor from 'jodit-react'

interface RichTextEditorProps {
  setDescription: (description: string) => void
  description: string
  config: any
}

const RichTextEditor = ({
  setDescription,
  description,
  config,
}: RichTextEditorProps) => {
  const editor = useRef(null)
  return (
    <JoditEditor
      ref={editor}
      value={description}
      onChange={(newContent) => setDescription(newContent)}
      config={config}
    />
  )
}

export default RichTextEditor
