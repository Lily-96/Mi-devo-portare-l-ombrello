import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function CityWeather() {
  const [meteo, setMeteo] = useState(null);
  const [previsioni, setPrevisioni] = useState([]);

  useEffect(() => {
    const dati = localStorage.getItem("meteoData");
    if (dati) {
      const info = JSON.parse(dati);
      setMeteo(info);
      caricaPrevisioni(info.lat, info.lon);
    }
  }, []);

  const caricaPrevisioni = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=33ae4343d5147809144aa401606cedbb&units=metric&lang=it`
      );

      if (!res.ok) {
        throw new Error("Errore nella risposta del server");
      }

      const data = await res.json();

      if (!data.list || !Array.isArray(data.list)) {
        throw new Error("Formato dati non valido");
      }

      const giorniUnici = [];
      const giorniVisti = new Set();

      data.list.forEach((el) => {
        const [dataGiorno, ora] = el.dt_txt.split(" ");
        if (ora === "12:00:00" && !giorniVisti.has(dataGiorno)) {
          giorniUnici.push(el);
          giorniVisti.add(dataGiorno);
        }
      });
      // 👆QUESTO L'HO CERCATO CON GLI AIUTI DIFFICILISSIMO
      setPrevisioni(giorniUnici.slice(0, 5));
    } catch (err) {
      console.error("Errore nel recupero previsioni:", err.message);
    }
  };
  const sfondo = () => {
    if (!meteo) return "";
    const desc = meteo.weather.description.toLowerCase();
    if (desc.includes("pioggia")) {
      return "url(https://images.unsplash.com/photo-1534274988757-a28bf1a57c17)";
    } else if (desc.includes("nubi")) {
      return "url(https://images.unsplash.com/photo-1532178910-7815d6919875)";
    } else if (desc.includes("sole")) {
      return "url(https://images.unsplash.com/photo-1621500580725-4276438a56f8)";
    } else {
      return "url(https://images.unsplash.com/photo-1513002749550-c59d786b8e6c)";
    }
  };

  if (!meteo) {
    return (
      <Container className="text-center mt-5 text-white">
        <h4>Nessuna città selezionata.</h4>
        <Link to="/">
          <Button variant="light">Torna alla Home</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container
      fluid
      style={{
        backgroundImage: sfondo(),
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2.5rem",
        color: "white",
      }}
      className="text-center"
    >
      <h1>
        {meteo.city}, {meteo.country}
      </h1>
      <h2>{meteo.weather.description}</h2>
      <p>Temperatura: {meteo.weather.temperature}°C</p>
      <p>Umidità: {meteo.weather.humidity}%</p>

      <h3 className="mt-4">Previsioni prossimi giorni</h3>

      <Row className="justify-content-center mt-3">
        {previsioni.map((item, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={2} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{new Date(item.dt_txt).toLocaleDateString("it-IT", { weekday: "long" })}</Card.Title>
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} />
                <Card.Text>
                  {item.main.temp.toFixed(1)}°C
                  <br />
                  {item.weather[0].description}
                </Card.Text>
                {/* 👆 ANCHE QUI AIUTINO */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-4">
        <Link to="/">
          <Button variant="outline-light">Torna alla Home</Button>
        </Link>
      </div>
    </Container>
  );
}

export default CityWeather;
