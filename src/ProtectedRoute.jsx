
import { useSelector } from 'react-redux'

const ProtectedRoute = ({children}) => {
    const {data} = useSelector((state)=>state.auth)
      if(data?.user_Role === 'Admin'){
    return children;
    }else{
        return(
            <div className="min-h-[60vh] flex items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">
        Access Denied
      </h1>
    </div>
    )
    }
}

export default ProtectedRoute