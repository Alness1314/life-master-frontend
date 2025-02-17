import React, { useState } from "react";
import { Card, CardBody, CardHeader, Switch } from "@material-tailwind/react";
import Footer from "./Footer";
import MaterialButton from "../components/MaterialButton";
import MaterialInput from "../components/MaterialInput";
import MaterialTypography from "../components/MaterialTypography";

function Login({ darkMode, toggleDarkMode, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Guardar token en localStorage
        localStorage.setItem("user", username); // Guardar nombre de usuario en localStorage
        setError(""); // Limpiar errores
        onLogin(data.token); // Llamar a onLogin con el token
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <section
      className={`px-8 ${darkMode ? "bg-gray-900" : "bg-white"}`}
      style={{
        backgroundImage: `url(${process.env.REACT_APP_BACKGROUND_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Botón para cambiar entre modo claro y oscuro */}
      <div className="absolute top-4 right-4">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          label={darkMode ? "Modo Oscuro" : "Modo Claro"}
          color="deep-purple"
        />
      </div>

      <div className="container mx-auto h-screen grid place-items-center">
        <Card
          shadow={false}
          className={`md:px-12 md:py-10 py-8 border rounded-lg w-full max-w-md ${
            darkMode ? "bg-gray-900/90 border-gray-800" : "bg-gray-50/90 border-gray-200"
          }`}
        >
          <CardHeader shadow={false} floated={false} className="text-left bg-transparent">
            <div className="flex justify-center mb-2">
              <img src="/img/logo.png" alt="Icono" className="w-24 h-24 mb-4" />
            </div>
            <MaterialTypography
              variant="h1"
              className="!text-3xl lg:text-4xl font-bold"
              darkMode={darkMode} // Pasar darkMode como prop
              light={"text-white"}
              dark={"text-gray-900"}
            >
              Inicio de Sesión
            </MaterialTypography>
            <MaterialTypography
              className="text-[14px] font-normal md:max-w-sm"
              darkMode={darkMode} // Pasar darkMode como prop
              light={"text-gray-300"}
              dark={"text-gray-600"}
            >
              Ingresa tu correo electrónico y contraseña.
            </MaterialTypography>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 md:mt-8">
              <div>
                <MaterialInput
                  id="username"
                  mode={darkMode}
                  type="text"
                  label="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={darkMode ? "text-white" : "text-gray-900"}
                />
              </div>

              <div>
                <MaterialInput
                  id="password"
                  mode={darkMode}
                  type="password"
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={darkMode ? "text-white" : "text-gray-900"}
                />
              </div>

              {/* Mostrar mensaje de error */}
              {error && (
                <MaterialTypography
                  className="text-center text-red-500 text-sm"
                >
                  {error}
                </MaterialTypography>
              )}

              <MaterialButton
                mode={darkMode}
                fullWidth
                className="mt-4"
                type="submit"
              >
                Ingresar
              </MaterialButton>

              <MaterialTypography className="text-center">
                <a
                  href="/"
                  className={`${
                    darkMode ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-500 hover:text-indigo-700"
                  }`}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </MaterialTypography>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Footer fijo */}
      <Footer />
    </section>
  );
}

export default Login;