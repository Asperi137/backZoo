import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import Link from 'next/link'
import Animaux from 'Types/Animaux'
import Especes from 'Types/Especes'
import Enclos from 'Types/Enclos'
import Zones from 'Types/Zones'
import InfoEspece from 'components/ui/barreInfo/InfoEspece'
import InfoEnclos from 'components/ui/barreInfo/InfoEnclos'
import IsConnected from 'lib/isConnected'
import apiConnect from 'lib/apiConnect'
import BoutonAction from 'components/ui/boutonAction/BoutonAction'
import InfoAnimal from 'components/ui/barreInfo/InfoAnimal'
import { useState } from 'react'
import BoutonEntrerSortir from 'components/ui/boutonAction/BoutonEntrerSortir'
import Evenements from 'Types/Evenements'
import TableauEvent, { tri } from 'components/ui/TableauEvent/TableauEvent'
import { withSessionSsr } from 'lib/withSession'
import User from 'Types/User'

type props = {
  animal: Animaux
  espece: Especes
  enclos: Enclos
  zone: Zones
  event: Evenements[]
  user: User
  headers: Headers
}

export default function Index ({
  animal,
  espece,
  enclos,
  zone,
  event,
  user,
  headers
}: props): JSX.Element {
  const [position, setPosition] = useState(animal.position)

  return (
    <div className='containerV'>
      {IsConnected(user) && (
        <>
          <button className='btnRetour'>
            <Link href={`/especes/${espece._id}`} as={`/especes/${espece._id}`}>
              {`retour à l'especes : ${espece.nom} `}
            </Link>
          </button>

          <div className='containerV'>
            <div className='containerH'>
              <h2 className='alignCenter'>{animal.nom}</h2>
              <InfoAnimal animal={animal} position={position} />
              <InfoEspece espece={espece} />
              <InfoEnclos enclos={enclos} zone={zone} />
            </div>
            {(IsConnected(user) === 'veterinaire' ||
              IsConnected(user) === 'admin') && (
              <BoutonAction
                headers={headers}
                cible={animal._id}
                action={'soigner'}
              />
            )}
            <BoutonEntrerSortir
              headers={headers}
              cible={animal._id}
              position={position}
              setPosition={setPosition}
            />
          </div>
          <TableauEvent affichage={event} />
        </>
      )}
      {!IsConnected(user) && (
        <button className='btnRetour'>
          <Link href='/'>Veillez vous connecter</Link>
        </button>
      )}
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps ({ params, req }: Params) {
    const headers = req.headers
    const user = req.session.user
    const animal = await fetch(`${apiConnect()}animaux/${params.id}`, {
      headers
    }).then(res => res.json())
    const espece = await fetch(`${apiConnect()}especes/${animal.espece}`, {
      headers
    }).then(res => res.json())
    const enclos = await fetch(`${apiConnect()}enclos/${espece.enclos}`, {
      headers
    }).then(res => res.json())
    const zone = await fetch(`${apiConnect()}zones/${enclos.zone}`, {
      headers
    }).then(res => res.json())
    const event = tri(
      await fetch(`${apiConnect()}evenements/animaux/${params.id}`, {
        headers
      }).then(res => res.json())
    )

    return {
      props: {
        animal,
        espece,
        enclos,
        zone,
        event,
        user,
        headers
      }
    }
  }
)
