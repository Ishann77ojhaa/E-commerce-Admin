import { useParams } from "react-router-dom"
import Sproduct from "./Sproduct";
import Reviews from "./Reviews";


const SingleProduct = () => {
    const {id} = useParams();
  return (
    <div>
       <Sproduct id = {id}/>
       <Reviews/>
    </div>
  )
}

export default SingleProduct