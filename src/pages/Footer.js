import React from 'react';
import { Typography } from "@material-tailwind/react";

const currentYear = new Date().getFullYear();

function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-black/70 py-4 text-right px-4">
            <Typography className="text-white">
                 © {currentYear} Life Master. Todos los derechos reservados.
            </Typography>
        </footer>
    );
}

export default Footer;