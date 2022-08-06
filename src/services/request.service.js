import axios from 'axios'
import header from './header';

class RequestService{
    constructor(){
        this.header = ()=>header();
    }
    request(url,data,method){
        console.log(method,data,url)
        return axios[method](url,data,this.header)
            .then(({status,data})=>{
                
                console.info('init app request with status code '+status)
                
               
                return data
               
            }).catch((err)=>{
                console.info('init app response whit status code '+err)
                return Promise.reject(err)
            })
    }
}

export default RequestService