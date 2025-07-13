import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import './index.css'
import App from './App.tsx'
import ErrorPage from "./genericPages/ErrorPage.tsx";
import LobbyView from "./lobby/LobbyView.tsx";
import IndexPage from "@/genericPages/IndexPage.tsx";
import {WebSocketProvider} from "@/WebSocketProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WebSocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<IndexPage/>}/>
                    <Route path="/test" element={<App/>}/>
                    <Route path="/lobby/:lobbyId" element={<LobbyView/>}/>
                    <Route path='/*' element={<ErrorPage/>}/>
                </Routes>
            </BrowserRouter>
        </WebSocketProvider>
    </StrictMode>,
)
