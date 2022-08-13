import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import InitService from '../../services/init.service'
import RequestService from '../../services/request.service';

const initial = {
    context:{},
    ui:{},
    loading: false,
    message: '',
    showing_modal: 'none',
    redirect_helper: null,
    view: 'landing_view',
    request_status: null
}
export const init = createAsyncThunk('app/init', async (data) => {
    let Init = new InitService(data);
    Init.initApp().then(data => {
        return data
    }).catch(err => {
        return err
    })
})

export const apiRequest = createAsyncThunk('app/request', ({ data, url, method }) => {
    const request = new RequestService()
    return request.request(
        url,
        data,
        method
    )
        .then((response) => {
            return Promise.resolve(response)
        }).catch((err) => {

            return Promise.reject(err)
        })
})

const appSlice = createSlice({
    name: 'app',
    initialState: initial,
    extraReducers: (builder) => {
        builder.addCase(init.pending, (state, action) => {
            state.loading = true;
            state.message = 'Iniciando aplicacion';
            state.view = 'loading_page'
        })
            .addCase(init.fulfilled, (state, action) => {
                
                state.loading = false;
                state.message = 'Bienvenido';
                state.context = action.payload.context;
                state.ui = action.payload.ui;
                state.view = 'home'
            })
            .addCase(init.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message;
                state.view = '';
            })
            .addCase(apiRequest.pending, (state, action) => {
                state.loading = true;
                state.message = 'Realizando peticion';
                state.request_status = null
            })
            .addCase(apiRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = 'Exito';
                state.request_status = true
                updateContext()
            })
            .addCase(apiRequest.rejected, (state, action) => {
                state.loading = false;
                state.message = 'Ocurrio un error'
                state.request_status = false
            })
    },
    reducers: {
        changeUiView: selectView,
        contextUpdate: updateContext,
        contextHydrate: hidrateContext,
        dialogController: setShowingDialog,
        initializer:initApp,
    }

})

function initApp(state, action){
    
    let {context,ui} = action.payload
    state.ui = ui
    state.context = context
}

function hidrateContext(state, action) {
    let { property, data } = action.payload; //quey is an pbject that has 
    state[property] = data;
}

function setShowingDialog(state, action) {
    let { item, target } = action.payload
    let { target: action_target, target_config } = target
    if(target_config===undefined){  
        state.showing_modal = action_target
    }else{
        if (target_config.pass_item === true ) {
            state.redirect_helper = { item: item, ...target };
            state.showing_modal = action_target
        } 
    }
}


function selectView(state, action) {
    let view = action.payload;
    state.view = view;
}

function updateContext(state, action) {
    // item_identifier is an object. it's property is the item's property identifier and it's value the param
    let { action_type, property, item_identifier, data } = action.payload; //quey is an pbject that has 
    const pre_state = state.context[property]
    
    switch (action_type) {
        case 'delete':
            state.context[property] = findAndDelete(pre_state, item_identifier)
            break;
        case 'update':
            state.context[property] = findAndUpdate(pre_state, item_identifier, data);
            break;
        case 'add':
            state.context[property] = addItem(pre_state, data)
            break
        default:
            console.error('Not a valid type of action provided')
            break
    }


}


const findAndDelete = (array, item_identifier) => { //target is an object that's suposed contains an property that matches with identifier arg, and contains an array of objectes;
    let [identifier] = Object.entries(item_identifier)

    const index = array.findIndex((item) => {
        return item[identifier[0]] === identifier[1]
    })
    
    array.splice(index, 1);//this functions returns an object idently to target
    return array
}

const findAndUpdate = (array, item_identifier, data) => {
    let [identifier] = Object.entries(item_identifier)

    const index = array.findIndex((item) => {
        return item[identifier[0]] === identifier[1]
    })
    
    array[index] = data;//this functions returns an object idently to target
    return array
}

const addItem = (array, data) => {

    array.push(data)
    return array
}

export const { changeUiView, contextUpdate, contextHydrate, dialogController , initializer} = appSlice.actions;
export default appSlice.reducer

