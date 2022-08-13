
import { useState } from "react"
import { Suspense } from "react"
import App,{init} from '../hooks/Faci'

export default function LandingPage() {

    const [session, setSession] = useState(false)
    const handleClick = async () => {
        let res = await init.initApp()
        if (res) {
            setSession(true)
        }
    }


    return (
        <>
            {(!session) ?
                <div className="front-page">
                    <h1>Hola, inicia sesion:</h1>
                    <button
                        onClick={() => handleClick()}
                    >Iniciar sesion</button>
                </div>
                :
                <Suspense>
                    <App/>
                </Suspense>
            }
        </>
    )
}