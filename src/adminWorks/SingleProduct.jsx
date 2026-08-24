import { useParams } from "react-router-dom"


const SingleProduct = () => {
    const {id} = useParams();
  return (
    <div>
        siuuuu {id}
    </div>
  )
}

export default SingleProduct