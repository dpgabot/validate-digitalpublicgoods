import Header from "../components/header";
import Footer from "../components/footer";

export default function Layout(props) {
  if (props.progress && props.label) {
    return (
      <>
        <Header />
        <main>{props.children}</main>
        <Footer progress={props.progress} label={props.label} />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <main>{props.children}</main>
      </>
    );
  }
}
