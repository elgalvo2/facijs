import AppModal from '../appModal/AppModal'
import createView from '../createView/CreateView'


export default function createModal(component, app) {

    console.log('modal rendered')

    return (
        <AppModal
            children={
                createView(component, app)
            }
            app={app}
        />
    )
}

