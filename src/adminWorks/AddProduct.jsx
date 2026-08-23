import Loader from "../globals/loader/loader";
import { STATUSES } from "../globals/misc/statuses";

const AddProduct = () => {

    // Loading
if (status === STATUSES.LOADING) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader message="Please Wait"/>
      </div>
    );
  }
  return (
    <div>AddProduct</div>
  )
}

export default AddProduct