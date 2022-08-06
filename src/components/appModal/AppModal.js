import { useDispatch, useSelector } from 'react-redux'
import styles from './appModal.module.css'


export default function AppModal({ children, app }) {
    let { showing_modal } = useSelector(state => state[app.store_name])
    let dispatch = useDispatch()
    let target = {
        target: 'none'
    }
    
    return (
        <>
            {(showing_modal !== 'none') && <div className={styles.dialog_background}
                onClick={() => dispatch(app.dialogController({ target }))}
            >
            </div>}
            <dialog open={showing_modal !== 'none'} className={styles.dialog}>
                <button className={styles.exit}
                    onClick={() => dispatch(app.dialogController({ target }))}
                >Salir</button>
                {children}
            </dialog>
        </>
    )
}