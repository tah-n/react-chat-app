
const Backdrop = (props) => {
  return (
    props.show && <div className="absolute z-40 w-screen h-screen top-0 left-0 bg-transparent" onClick={props.modalClosed}></div> 
  )
}

export default Backdrop;
