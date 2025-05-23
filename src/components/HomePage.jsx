import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  const [cityName, setCityName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [caricato, setCaricato] = useState(false);
  const [informazioniBase, setInformazioniBase] = useState(null);

  const searchCity = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setCaricato(false);
    setInformazioniBase(null);
    try {
      const openWeather = await fetch(` https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=33ae4343d5147809144aa401606cedbb`);
      const openWeatherResult = await openWeather.json();

      if (openWeatherResult.length === 0) {
        setErrorMsg("Spiacente, non ho trovato questa città.");
        return;
      }

      const { name, country, lat, lon } = openWeatherResult[0];

      const weatherResponse = await fetch(`
        https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=33ae4343d5147809144aa401606cedbb&units=metric&lang=it
     `);
      const weatherResult = await weatherResponse.json();

      const meteoInfo = {
        city: name,
        country,
        lat,
        lon,
        weather: {
          temperature: weatherResult.main.temp,
          humidity: weatherResult.main.humidity,
          description: weatherResult.weather[0].description,
          iconCode: weatherResult.weather[0].icon,
        },
      };

      localStorage.setItem("meteoData", JSON.stringify(meteoInfo));
      setInformazioniBase({
        lat,
        lon,
        temperature: weatherResult.main.temp,
        description: weatherResult.weather[0].description,
        icon: weatherResult.weather[0].icon,
      });

      setCaricato(true);
    } catch (error) {
      setErrorMsg("C'è stato un problema nel recupero dei dati.");
    }
  };

  return (
    <Container
      fluid
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "3rem",
      }}
      className="text-center text-white"
    >
      <h1
        style={{
          background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
          padding: "10px 25px",
          borderRadius: "10px",
          marginBottom: "2rem",
        }}
      >
        Meteo nel mondo
      </h1>

      <Form onSubmit={searchCity} style={{ maxWidth: "350px", margin: "0 auto" }} className="mb-3">
        <Form.Control type="text" placeholder="Inserisci il nome della città" value={cityName} onChange={(e) => setCityName(e.target.value)} />
        <Button type="submit" className="mt-3" variant="dark" style={{ width: "100%" }}>
          Cerca
        </Button>
      </Form>

      {errorMsg && <p style={{ color: "#ff6b6b", fontWeight: "600" }}>{errorMsg}</p>}

      {informazioniBase && (
        <div className="mt-4 bg-dark bg-opacity-50 p-3 d-inline-block">
          <h4>Temperatura: {informazioniBase.temperature}°C</h4>
          <p>Condizioni: {informazioniBase.description}</p>
          <img src={`https://openweathermap.org/img/wn/${informazioniBase.icon}@2x.png`} alt={informazioniBase.description} />
        </div>
      )}

      {caricato && (
        <div>
          <Link to="/city-weather">
            <Button variant="outline-dark" size="lg" className="mt-3">
              Più dettagli
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
}

export default HomePage;
