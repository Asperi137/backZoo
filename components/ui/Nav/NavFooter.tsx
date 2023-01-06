import classes from './Nav.module.css'
import IsConnected from 'lib/isConnected'
import NavEnclos from './NavEnclos'
import NavEspeces from './NavEspeces'
import { useState } from 'react'
import NavAnimaux from './NavAnimaux'

export default function NavFooter () {
  const [affichage, setAffichage] = useState('')

  function modifAffichage (event: any) {
    event.preventDefault()
    if (affichage === event.target.name) setAffichage('')
    else setAffichage(event.target.name)
  }

  return (
    <>
      {IsConnected() && (
        <>
          <div onClick={event => modifAffichage(event)}>
            {affichage === 'enclos' && <NavEnclos />}
            {affichage === 'especes' && <NavEspeces />}
            {affichage === 'animaux' && <NavAnimaux />}
          </div>
          <nav className={classes.contH}>
            <button onClick={event => modifAffichage(event)} name='enclos'>
              Enclos
            </button>
            <button onClick={event => modifAffichage(event)} name='especes'>
              Especes
            </button>
            <button onClick={event => modifAffichage(event)} name='animaux'>
              Animaux
            </button>
          </nav>
        </>
      )}
    </>
  )
}
