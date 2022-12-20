import IsConnected from 'lib/isConnected'
import Link from 'next/link'
import Evenements from 'Types/Evenements'
import { SetStateAction, useState } from 'react'
import Especes from 'Types/Especes'
import Enclos from 'Types/Enclos'
import Animaux from 'Types/Animaux'
import Zones from 'Types/Zones'
import Type_evenements from 'Types/Type_evenements'
import TableauEvent, { tri } from 'components/ui/TableauEvent/TableauEvent'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { withSessionSsr } from 'lib/withSession'
import User from 'Types/User'
import apiConnect from 'lib/apiConnect'

type Props = {
  evenements: Evenements[]
  animaux: Animaux[]
  especes: Especes[]
  enclos: Enclos[]
  zones: Zones[]
  Type_evenements: Type_evenements[]
  user: User
  headers: Headers
}

export default function Index ({
  evenements,
  animaux,
  especes,
  enclos,
  zones,
  Type_evenements,
  user,
  headers
}: Props) {
  const [affichage, setAffichage] = useState<Evenements[]>(tri(evenements))
  const [choix, setChoix] = useState<string>('tout')
  const [choixT, setChoixT] = useState<string>('')

  async function filtrage (): Promise<void> {
    let resu = await fetch(`${apiConnect()}evenements`, {
      headers
    }).then(res => res.json())
    if (
      choixT === 'type' ||
      choixT === 'zones' ||
      choixT === 'enclos' ||
      choixT === 'especes' ||
      choixT === 'animaux'
    ) {
      resu = await fetch(`${apiConnect()}evenements/${choixT}/${choix}`, {
        headers
      }).then(res => res.json())
    }
    setAffichage(tri(resu))
  }

  return (
    <>
      {IsConnected(user) && (
        <>
          <div className='alignCenter'>
            <h2>
              Tableaux des evenements : {choixT} {choix}
            </h2>
          </div>
          <div className='containerH, alignCenter '>
            Filtrage :
            <button
              onClick={() => {
                setChoixT('tout')
                setChoix('')
                filtrage()
              }}
            >
              TOUT
            </button>
            <button
              onClick={() => {
                setChoixT('type')
                setChoix('')
              }}
            >
              Type
            </button>
            <button
              onClick={() => {
                setChoixT('zones')
                setChoix('')
              }}
            >
              Zones
            </button>
            <button
              onClick={() => {
                setChoixT('enclos')
                setChoix('')
              }}
            >
              Enclos
            </button>
            <button
              onClick={() => {
                setChoixT('especes')
                setChoix('')
              }}
            >
              Especes
            </button>
            <button
              onClick={() => {
                setChoixT('animaux')
                setChoix('')
              }}
            >
              Animaux
            </button>
          </div>
          <div className='containerH , bordered'>
            {choixT === 'type' &&
              Type_evenements.map(type => (
                <div key={type._id} className='containerV '>
                  <div
                    onClick={e => {
                      filtrage()
                      setChoix(type._id)
                    }}
                  >
                    {type.nom}
                  </div>
                </div>
              ))}
            {choixT === 'zones' &&
              zones.map(zone => (
                <div key={zone._id} className='containerV '>
                  <div
                    onClick={e => {
                      filtrage()
                      setChoix(zone._id)
                    }}
                  >
                    {zone.nom}
                  </div>
                </div>
              ))}
            {choixT === 'enclos' &&
              enclos.map(enclos => (
                <div key={enclos._id} className='containerV '>
                  <div
                    onClick={e => {
                      filtrage()
                      setChoix(enclos._id)
                    }}
                  >
                    {enclos.nom}
                  </div>
                </div>
              ))}
            {choixT === 'especes' &&
              especes.map(espece => (
                <div key={espece._id} className='containerV '>
                  <div
                    onClick={e => {
                      filtrage()
                      setChoix(espece._id)
                    }}
                  >
                    {espece.nom}
                  </div>
                </div>
              ))}
            {choixT === 'animaux' &&
              animaux.map(animal => (
                <div key={animal._id} className='containerV '>
                  <div
                    onClick={e => {
                      filtrage()
                      setChoix(animal._id)
                    }}
                  >
                    {animal.nom}
                  </div>
                </div>
              ))}
          </div>
          <TableauEvent affichage={affichage} />
        </>
      )}
      {!IsConnected(user) && (
        <button className='btnRetour'>
          <Link href='/'>Veillez vous connecter</Link>
        </button>
      )}
    </>
  )
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps ({ params, req }: Params) {
    const headers = req.headers
    const user = req.session.user

    const evenements: Evenements[] = await fetch(`${apiConnect()}evenements`, {
      headers
    }).then(res => res.json())

    const Type_evenements: Type_evenements[] = await fetch(
      `${apiConnect()}evenements/type`,
      { headers }
    ).then(res => res.json())

    const animaux: Animaux[] = await fetch(`${apiConnect()}animaux`, {
      headers
    }).then(res => res.json())

    const especes: Especes[] = await fetch(`${apiConnect()}especes`, {
      headers
    }).then(res => res.json())

    const enclos: Enclos[] = await fetch(`${apiConnect()}enclos`, {
      headers
    }).then(res => res.json())

    const zones: Zones[] = await fetch(`${apiConnect()}zones`, {
      headers
    }).then(res => res.json())

    return {
      props: {
        evenements,
        animaux,
        especes,
        enclos,
        zones,
        Type_evenements,
        user,
        headers
      }
    }
  }
)
