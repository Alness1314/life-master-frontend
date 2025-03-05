import React from 'react';
import { Typography } from "@material-tailwind/react";

function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-black/70 py-4 text-right">
            <Typography className="text-white">
                © 2025 Consejo de Contratos. Todos los derechos reservados.
            </Typography>
        </footer>
    );
}

export default Footer;