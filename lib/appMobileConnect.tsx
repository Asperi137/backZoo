export default function appMobileConnect () {
  if (!process.env.NEXT_PUBLIC_APP_MOBILE) {
    throw new Error('Please add your API_adr to .env.local')
  }
  return process.env.NEXT_PUBLIC_APP_MOBILE
}
