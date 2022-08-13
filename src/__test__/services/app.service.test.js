import AppService from '../../services/app.service'
import InitService from '../../services/init.service';
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




describe('test on app service',()=>{
    let init;
    let ui;
    let context;
    let app;
    
    beforeAll(async()=>{
        init = new InitService('',store,store_methods)
        await init.initApp({user:'',pass:''})
        ui = await store.getState().appFeature.ui
        context = await store.getState().appFeature.context
        app = new AppService(init)
        
    })

    test('appservice creates an instance correctly',()=>{
        expect(typeof app).toBe('object')
    })
    describe('test on initNav methos',()=>{
        test(' initializes nav correctly (testing on)', ()=>{
            let nav = app.initNav()
            
            expect(nav.length).toBe(ui.nav.options.length) //comproves ui nav property length matches nav array
            nav.forEach((item,index)=>{
                expect(item.label === ui.nav.options[index]).toBeTruthy() // initNav returns ans array objects
                // initNav array of objects cotains theese properties: label: string that matches thoose especified in ui.nav.options array ----- function: is a function that triggers change ui
                // method of app service instanse... (basically this methos changes a property named view in app.feature) <--- more explanation of this context property below...
            })
        })

        test("nav array's objects has property function that changes ui",()=>{
            let nav = app.initNav()
            nav.forEach((item)=>{
                let {function:fn} = item
                fn() // fn is a instance of changeui method of app service object 
                let view = store.getState().appFeature.view // changeUi method is a reducer of app.feature slice <--- see app.feature test for more info about
                //the behavior of this reducer
                expect(view).toMatch(item.label)
            })
        })
    })

    describe('test on initVisor method',()=>{
        test('initializes visor correctly',()=>{
            let visor =  app.initVisor()
            expect(visor.length).toEqual(Object.keys(ui.nav.layouts).length) //the visor array is a reference to the pages that the app will render
            // the amount of pages is equal to the nav.layouts property in ui context
        })
        test('visor array has object with correct properties',()=>{
            let visor = app.initVisor()
            visor.forEach((item,index)=>{
                expect(item.name).toMatch(Object.keys(ui.nav.layouts)[index]) // object's property name is the same as the specified in the ui.nav.layouts property<---- layouts
                //properties are a reference to the strings defined inside the ui.nav.options array
                item.components.forEach((compon,index)=>{
                    let { context_items, name,type,config, grid} = compon // grid is a property that has the following propertyes {rows,grid,fields}<--- this object is returned by the method destructureLayout 
                    // of the initApp class <---- this method is tested and described bellow
                    let component = ui.components[name] // the name property matches the name of the ui component property
                    let items = (type==='list')?context[config.store_name]:null; // only list type components have context_item property defined
                    expect(context_items).toEqual(items)
                    expect({type,config}).toEqual(component);
                })
            })
        })
    })

    describe('test on initModal Method',()=>{
        test('initilizes modal_components correctly',()=>{
            let modal_componets =  app.initModal()
            let counter = 0 
            Object.entries(ui.internal_nav).forEach(item=>{
                if(item[1].type==='modal-view' || item[1].type==='confirm_view' || item[1].type==='modal-view-action'){
                    counter+=1 //modal_componets is an array that references the internal_nav components stored in ui store context
                }// this type of internal_nav comopnents are modals displayed by the trgger of certain actions inside regular components (expecifically when an component action property type is redirect) <---- see documentation for more info
            })
            expect(modal_componets.length).toEqual(counter)
        })

        test('test internal_nav components properies initilizes correclty ',()=>{
            let modal_componets =  app.initModal()
            modal_componets.forEach((modal,index)=>{ // get through the modals array
                let {name,components,grid} = modal;
                let type = ui.internal_nav[name].type
                expect(ui.internal_nav[name]).toBeDefined();
                components.forEach(component=>{
                    if(type==='modal-view'){
                        let {type,context_items,config,name} = component
                        expect(ui.components[name]).toBeDefined();
                        if(type!=='list'){
                            expect(context_items).toBeNull();
                        }
                        expect(ui.components[name].config).toEqual(config)
                    }
                })
                
            })
        })
    })



    
})