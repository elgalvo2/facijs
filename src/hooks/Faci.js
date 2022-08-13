import { useState, useEffect, useRef, useCallback } from "react";
import AppService from "../services/app.service";
import CreateView, { MemoCreateView } from "../components/createView/CreateView";
import createModal from "../components/createModal/CreateModal";
import { useSelector } from "react-redux";
import InitService from "../services/init.service";
import store from "../redux/store";
import '../App.css'
import {changeUiView,contextUpdate,contextHydrate, apiRequest,dialogController, initializer } from '../redux/slices/app.feature'

const store_methods = {
    uiController:changeUiView,
    contextController:contextUpdate,
    contextHydrate,
    requestMethod:apiRequest,
    dialogController,
    init:initializer,
}

export const init = new InitService('', store, store_methods )
const app = new AppService(init)



export function useMagic(options) {

    console.info('Use magic redered')


    let [nav, setNav] = useState([]);
    let [visor, setVisor] = useState([]);
    let [modal, setModal] = useState([])



    const construct_app = async()=>{
        let modal,views,navItems;
            //inicializa array con items referentes a las paginas de la aplicacion
            navItems = await app.initNav();
            //inicializa el visor
            views = await app.initVisor();
            
            modal = await app.initModal();

            modal.forEach((modal_component) => {
                
                setModal(prev => {
                    return [...prev, { name: modal_component.name, component: createModal(modal_component, app) }]
                })
            })
            views.forEach((view) => {
                setVisor(prev => {
                    return [...prev, { name: view.name, component:CreateView(view,app) }]
                })
            })
            // initilizes modal
            setNav(navItems);

    }


    useEffect(() => {
         
        construct_app()

        return () => {
            setNav([])
            setVisor([])
        }
    }, [])


    return { nav, visor, modal }
}


export default function App() {

    console.log('aapp rendered')

    let {nav, visor, modal } = useMagic(init)
    
    const { view, showing_modal } = useSelector(state => state.appFeature)
    return (
        <div className="upper">
            <div className="layout">
                <div className="main-header">
                </div>
                <div className="main-body">
                    <div className="main-nav">
                        <nav>
                            {(nav.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => item.function()}
                                    className='nav-item'
                                >
                                    {item.label}
                                </div>
                            )))}
                        </nav>
                    </div>
                    <div className="main-visor">
                        {(visor.map((item, index) => (item.name === view) && <div key={index}>{item.component}</div>))}
                    </div>
                </div>
            </div>
            {(showing_modal!=='none')&&(modal.map((item,index)=>(item.name===showing_modal)&&<div key={index}>{item.component}</div>))}
            
        </div>
    )
}



