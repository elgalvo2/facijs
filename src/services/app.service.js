import axios from 'axios'

import RequestService from './request.service';

class AppService {
    constructor(init) {
        let { store, store_name, api_url, store_methods } = init;
        let { uiController, contextController, contextHydrate, requestMethod, dialogController } = store_methods;

        this.uiController = uiController;
        this.contextController = contextController;
        this.contextRefresh = contextHydrate;
        this.storeRequest = requestMethod;
        this.dialogController = dialogController



        this.store = store;
        this.store_name = store_name;
        this.api_url = api_url

        this.RequestHandler = new RequestService()
    }

     initNav() {
        let nav = []
        let { pages } =  this.getUi()
        pages.forEach(element => {
            let item = { label: element, function: () => this.changeUi(element) }
            nav.push(item)
        });
        return nav
    }

    initVisor() {
        let visor = []
        let { components, pages_layouts } = this.getUi();

        for (let [view, layout] of Object.entries(pages_layouts)) {
            let { fields, grid } = this.destructureLayout(layout)
            let componentData = fields.map(item => {
                let data = components[item];
                let context_items = (data.type === 'list') ? this.getContext()[data.config.store_name] : null
                return {
                    context_items, //data contained in context aka arrays of data
                    name: item,
                    ...data,

                }
            })
            let item = { name: view, components: componentData, grid }
            visor.push(item)
        }

        return visor
    }

      initModal() {
        let modal_components = []
        let { internal_pages, components } =   this.getUi()

        for (let [view, data] of Object.entries(internal_pages)) {
            if (data.type === 'modal-view') { // only modals with type modal-view has regular components displayed on it
                let { fields, grid } = this.destructureLayout(data.config.layout)
                let componentData = fields.map(field => {
                    let context_items = (components[field].type === 'list') ? this.getContext()[data.config.store_name] : null
                    return {
                        type: data.type,
                        context_items,
                        ...components[field],
                        name: field,
                    }
                })
                modal_components.push({ name: view, components: componentData, grid })
            }

            if (data.type === 'confirm_view') {
                let { fields, grid } = this.destructureLayout(data.config.layout)
                let componentData = fields.map(field => {
                    return {
                        type: data.type,
                        name: field,
                        config: data.config
                    }
                })

                modal_components.push({ name: view, components: componentData, grid })
            }

            if (data.type === 'modal-view-action') {
                let { fields, grid } = this.destructureLayout(data.config.layout)
                let componentData = fields.map(field => {
                    return {
                        type: data.type,
                        name: field,
                        config: data.config
                    }
                })

                modal_components.push({ name: view, components: componentData, grid })
            }

        }
        return modal_components
    }



    updateContextAction({ data, store_target_name, item_identifier, action_type }) {
        return this.store.dispatch(this.contextController({ action_type, property: store_target_name, item_identifier, data }))
    }

    async requesAction({ data, end_point_url, method }) {
        return axios[method](this.api_url + end_point_url, data, this.header())
            .then((response) => {
                console.info('Api response ', response)
                return response
            }).catch((err) => {
                console.error('Api error response ', err)
                return err
            })
    }

    getStoreMethods() {
        return {
            uiController: this.uiController,
            contextController: this.contextController
        }
    }

    getUi() {
        let { nav, components, internal_nav } = this.store.getState()[this.store_name].ui
        return {
            pages: nav.options,
            components,
            pages_layouts: nav.layouts,
            internal_pages: internal_nav,
        }
    }

    changeUi(element) {
        return this.store.dispatch(this.uiController(element))
    }

    getContext() {
        return this.store.getState()[this.store_name].context
    }

    destructureLayout(layout) {

        let rows = layout.split('*')
        let grid = layout.split('').map(el => (el == '*') ? '' : el).join('')
        let fields = []
        rows.forEach(el => {
            el.split(' ').map(element => {
                const normalized = element.split('').map(i => (i == '"') ? '' : i).join('')
                return (!fields.includes(normalized)) && fields.push(normalized)
            })
        })
        return {
            rows,
            grid,
            fields
        }
    }

    getActionModal(config) {
        let initial_value = {}
        let initial_error = {}
        let validations = {}
        let component_fields = []
        let { target_config,item} = config
        let {fields,layout,no_editable_properties} = target_config
        let {grid} = this.destructureLayout(layout)
        

        fields.forEach((field) => {
            if(item[field.label]!==undefined && !no_editable_properties.includes(field.label)){
                switch (field.type) {
                    case 'text':
                        initial_value[field.label] = item[field.label] 
                        initial_error[field.label] = ''  //this enables the use of field default value
                        break;
                    case 'checkbox':
                        initial_value[field.label] = item[field.label]
                        // initial_error[field.label] = item[field.label]
                        break;
                    default:
                        console.error('No hay tipo especificado en el campo', field.label, 'del component para el componente', config.title)
                        break
                }
                switch (field.validations) {
                    case 'only-text':
                        validations[field.label] = (input) => (input.match(/^[A-Za-z ]+$/)) ? { pass: true, error: null } : { pass: false, error: 'Ingrese solo letras' }
                        break;
                    case 'only-10-numbers':
                        validations[field.label] = (input) => (input.match(/^\d{10}$/)) ? { pass: true, error: null } : { pass: false, error: 'Ingrese solo 10 numeros' }
                        break;
                    case 'custom':
                        validations[field.label] = (input) => (input.match(new RegExp(field.custom_validation, field.validation_flag))) ? { pass: true, error: null } : { pass: false, error: field.validation_message } // this enables custom validation for fields
                        break;
                    default:
                        validations[field.label] = () => { return { pass: true, error: null } }
                        break
                }
                component_fields.push(field)
            }
        })


        return { initial_value, validations,component_fields,grid,initial_error }
    }

    getComponent(name, items) {
        let component = this.store.getState()[this.store_name].ui.components[name]
        switch (component.type) {
            case 'form':
                return this.formConstruct(component)
            case 'list':
                return this.listConstruct(component, items)
            default:
                break
        }
    }

    formConstruct(formConfig) {

        let initial_value = {}
        let validations = {}
        let { config } = formConfig
        let { fields: form_fields } = config


        form_fields.forEach((field) => {
            switch (field.type) {
                case 'text':
                    initial_value[field.label] = field.default || '' //this enables the use of field default value
                    break;
                case 'checkbox':
                    initial_value[field.label] = field.default || false
                    break;
                default:
                    console.error('No hay tipo especificado en el campo', field.label, 'del component para el componente', config.title)
                    break
            }
            switch (field.validations) {
                case 'only-text':
                    validations[field.label] = (input) => (input.match(/^[A-Za-z ]+$/)) ? { pass: true, error: null } : { pass: false, error: 'Ingrese solo letras' }
                    break;
                case 'only-10-numbers':
                    validations[field.label] = (input) => (input.match(/^\d{10}$/)) ? { pass: true, error: null } : { pass: false, error: 'Ingrese solo 10 numeros' }
                    break;
                case 'custom':
                    validations[field.label] = (input) => (input.match(new RegExp(field.custom_validation, field.validation_flag))) ? { pass: true, error: null } : { pass: false, error: field.validation_message } // this enables custom validation for fields
                    break;
                default:
                    validations[field.label] = () => { return { pass: true, error: null } }
                    break
            }

        })

        return { initial_value, validations }
    }
    listConstruct(listConfig, items) {
        let { config } = listConfig
        let { fields: controller_options } = this.destructureLayout(config.controller.layout)
        let { fields: item_fields } = this.destructureLayout(config.item_layout)
        // let items = useSelector(state=>state[this.store_name]).context[config.store_name]
        let controllers = {};
        let search_options = item_fields
        let filter_options = {}

        controller_options.forEach(contoller => {
            controllers[contoller] = ''
        })
        item_fields.forEach(field => {
            filter_options[field] = []
            items.forEach(item => {
                (!filter_options[field].includes(item[field])) && filter_options[field].push(item[field])
            })

        })
        return { controllers, filter_options, search_options }
    }

    async requestAndUpdateContextAction({ data, component_name, action, item_identifier }) {
        console.log(component_name,'requestand update')
        
        let { store_name: store_target_name, actions } = this.getUi().components[component_name].config
        let { end_point, method, store_update_action } = actions[action]

        try {
            let response = await this.RequestHandler.request(this.api_url + end_point, data, method)
            // await this.store.dispatch(this.storeRequest({ data, url: this.api_url + end_point, method }))
            // const { request_status } = await this.store.getState()[this.store_name]
            if (response.success) {
                this.store.dispatch(this.contextController({ action_type: store_update_action, property: store_target_name, item_identifier, data: response.data }))
                return true
            } else {
                return false
            }
        } catch (err) {
            console.error(err)
        }
    };

    async continueAction(action_name,data) {
        let helper_item = this.getHelperItem()
        
        let { item,target_config } = helper_item
        console.log(item)
        let to_send = {...item}
        let {actions} = target_config
        
        let {end_point,method,store_target_name,store_update_action,send_data} = actions[action_name]
        try {
            if(send_data===true){
                for(let [key,value] of Object.entries(data)){
                    to_send[key] = value
                }
            }
            let response = await this.RequestHandler.request(this.api_url + end_point, to_send, method)
            if (response.success) {
                this.store.dispatch(this.contextController({ action_type: store_update_action, property: store_target_name, item_identifier: { _id: item._id }, data: response.data }))
                this.store.dispatch(this.dialogController({ target: 'none' }))
                return true
            } else {
                return false
            }
        } catch (err) {
            console.error(err)
        }
    }

    getHelperItem() {
        return this.store.getState()[this.store_name].redirect_helper
    }
}


export default AppService