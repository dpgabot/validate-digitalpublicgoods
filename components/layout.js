import Header from '../components/header'
import Footer from '../components/footer'

export default function Layout (props) {
  return (
    <>
      <Header/>
      <main>
        {props.children}
      </main>
      <Footer progress={props.progress} />
    </>
  )
}
