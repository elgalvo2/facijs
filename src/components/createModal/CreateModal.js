import AppModal from '../appModal/AppModal'
import createView from '../createView/CReateView'


export default function createModal(component, app) {
    return (
        <AppModal
            children={
                createView(component, app)
            }
            app={app}
        />
    )
}

