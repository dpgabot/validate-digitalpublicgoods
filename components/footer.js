import Link from 'next/link'
import {ProgressBar} from 'react-bootstrap'

export default function Footer (props) {
  return (
    <footer className='text-center'>
      <ProgressBar now={props.progress} className='mb-2'  label={props.label}/>
    </footer>
  )
}
