import InitService from "../../services/init.service";
import store from '../../redux/store'
import {changeUiView,contextUpdate,contextHydrate, apiRequest,dialogController, initializer }  from '../../redux/slices/app.feature'


const store_methods = {
    uiController:changeUiView,
    contextController:contextUpdate,
    contextHydrate,
    requestMethod:apiRequest,
    dialogController,
    init:initializer,
}

describe('Test on initService',()=>{

    test('Service creates an instance correctly',()=>{
        let init = new InitService()
        expect(typeof init).toBe('object')
    })

    test('initapp method sends request properly',async()=>{
        let init = new InitService('',store,store_methods)
        await expect(init.initApp()).rejects.toBeDefined() // throw string defined in error:''
    })

    test('initapp method initilizes app properly',async()=>{
        let init = new InitService('',store,store_methods)
        await expect(init.initApp({user:'',pass:''})).resolves.toBe(true) //this methos has tu retur true. If true return credentials are stored in local
        //storage and app store gets ui and context properties of response's data
    })

})