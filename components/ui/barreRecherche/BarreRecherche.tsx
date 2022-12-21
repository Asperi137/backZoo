import IsConnected from 'lib/isConnected'
import recherche from 'lib/recherche'
import { useRouter } from 'next/router'

export default function BarreRecherche () {
  const router = useRouter()

  const formSubmit = async (event: any) => {
    event.preventDefault()
    if (!event.target.recherche.value) {
      alert('Veuiller entrer le sujet de votre recherche')
    } else {
      recherche(event.target.recherche.value.toLowerCase().trim(), router)
    }
  }

  return (
    <>
      {IsConnected() && (
        <form id='login' onSubmit={formSubmit}>
          <input type='search' id='recherche' name='recherche' required />
          <button type='submit'>rechercher</button>
        </form>
      )}
    </>
  )
}
