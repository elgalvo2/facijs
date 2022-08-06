import {configureStore} from '@reduxjs/toolkit'
import appFeature from './slices/app.feature'


export default configureStore({
    reducer:{
          appFeature,  
    }
})