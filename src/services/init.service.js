import axios from 'axios' 

class InitService{
    constructor(api_url,log_in_path,log_out_path,store,store_name,store_methods){
        this.api_url = api_url;
        this.sessionServePath = log_in_path;
        this.sessionDestroyPath = log_out_path;
        this.store = store;
        this.store_name = store_name;
        this.store_methods = store_methods
    }
    initApp(req){

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
            }).catch(({response})=>{
                const { status, data } = response;
                const { success, error } = data;
                console.info('init app response whit status code '+status)
                return Promise.reject(error)
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