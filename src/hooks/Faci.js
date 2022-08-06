import { useState, useEffect, useRef, useCallback } from "react";
import AppService from "../services/app.service";
import createView from "../components/createView/CReateView";
import createModal from "../components/createModal/CreateModal";


export function useMagic(init, options) {
    let [nav, setNav] = useState([]);
    let [visor, setVisor] = useState([]);
    let [modal, setModal] = useState([])

    useEffect(() => {
        const app = new AppService(init)
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
                    return [...prev, { name: view.name, component: createView(view, app) }]
                })
            })
            // initilizes modal
            setNav(navItems);

        }
        construct_app()

        return () => {
            setNav([])
            setVisor([])
        }
    }, [])


    return { nav, visor, modal }
}




