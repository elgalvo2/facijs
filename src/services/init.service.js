import axios from 'axios' 

class InitService{
    constructor(log_out_path,store,store_methods){
        this.api_url = process.env.REACT_APP_API_URL;
        this.sessionServePath = process.env.REACT_APP_LOG_IN_PATH;
        this.sessionDestroyPath = log_out_path;
        this.store = store;
        this.store_name = 'appFeature';
        this.store_methods = store_methods;
    }
    initApp(req){
        console.log(this.api_url,this.sessionServePath)
        return axios.post(this.api_url+this.sessionServePath,req)
            .then(({status,data})=>{
                console.info('init app response whit status code '+status)
                const {success,data:response_data,error} = data;
                if(success===true){
                    const {context,ui,credentials} = response_data;
                    localStorage.setItem('auth',JSON.stringify(credentials))
                    this.store.dispatch(this.store_methods.init({context,ui}))
                    return Promise.resolve(true)
                }else{
                    return Promise.reject(error)
                }
            }).catch((err)=>{
                console.info('init app response whit error '+err)
                return Promise.reject(err)
            })
    }
    endApp(){
        localStorage.removeItem('auth');
        const s = localStorage.getItem('auth');
        if (!s) {
            clearInterval(window.clearSessionTimmer)
            return true;
        }
        if (s) return false;
    }
}

export default InitService;