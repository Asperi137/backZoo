import { UserContext } from 'lib/UserContext'
import { useContext, useState } from 'react'
import apiConnect from 'lib/apiConnect'

type props = {
  cible: string
  action: string
  headers: Headers
}

export default function BoutonAction ({ cible, action, headers }: props) {
  const { role } = useContext(UserContext)
  const [verif, setverif] = useState('')

  function valider (event: any) {
    let type = 'especes'
    let data = {}
    event.preventDefault()
    switch (action) {
      case 'soigner':
        {
          type = 'animaux'
        }
        break
      case 'verifier':
        {
          type = 'enclos'
        }
        break
    }
    switch (type) {
      case 'enclos':
        {
          data = {
            enclos: cible,
            createur: role,
            observations: event.target.observations.value
          }
        }
        break
      case 'especes':
        {
          data = {
            espece: cible,
            createur: role,
            observations: event.target.observations.value
          }
        }
        break
      case 'animaux':
        {
          data = {
            animal: cible,
            createur: role,
            observations: event.target.observations.value
          }
        }
        break
    }
    const JSONdata = JSON.stringify(data)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }
    fetch(`${apiConnect()}${type}/${action}`, options)
    setverif('')
  }
  function annuler (event: any) {
    event.preventDefault()
    setverif('')
  }

  return (
    <>
      {!verif && <button onClick={() => setverif('action')}>{action}</button>}
      {verif && (
        <form
          className='containerV'
          id={action}
          onSubmit={valider}
          method='POST'
        >
          <input
            type='text'
            id='observations'
            name='observations'
            placeholder={`observations ${action}`}
          />
          <br />
          <div>
            <button type='submit'>{action}</button>
            <button onClick={annuler}>annuler</button>
          </div>
        </form>
      )}
    </>
  )
}
