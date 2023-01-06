import { useState } from 'react'
import { useZxing } from 'react-zxing'
import { useRouter } from 'next/router'
import recherche from 'lib/recherche'

export default function Scan () {
  const [result, setResult] = useState('')
  const router = useRouter()

  const { ref } = useZxing({
    onResult (result) {
      setResult(result.getText())
    }
  })
  return (
    <>
      <div className='alignCenter'>
        <video ref={ref} />
      </div>
      <div className='alignCenter'>
        <button onClick={() => recherche(result.toLowerCase().trim(), router)}>
          Valider : {result}
        </button>
      </div>
    </>
  )
}
