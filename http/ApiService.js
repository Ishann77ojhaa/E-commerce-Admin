import { APIAuthenticated } from "../src/globals/http";


class ApiService{
    async getDatas(endpoint){
 const response = await APIAuthenticated.get(`/${endpoint}`);
        return response.data
       
    }
}

const api = new ApiService()
export default api