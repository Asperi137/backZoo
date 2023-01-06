import NavFooter from '../Nav/NavFooter'
import classes from './Footer.module.css'

export default function Footer () {
  return (
    <footer className={`${classes.Footer}`}>
      <NavFooter />
    </footer>
  )
}
