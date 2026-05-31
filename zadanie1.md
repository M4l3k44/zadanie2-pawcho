## Polecenia

### a) Budowanie obrazu

```bash
docker build -t jmalek623/weather-app:1.0.0 .
```

### b) Uruchomienie kontenera

```bash
docker run -d --name weather-app -p 8080:8080 jmalek623/weather-app:1.0.0
```

### c) Logi startowe

```bash
docker logs weather-app
```

### d) Liczba warstw i rozmiar obrazu

```bash
docker image inspect jmalek623/weather-app:1.0.0 --format "Warstwy: {{len .RootFS.Layers}}"
docker images jmalek623/weather-app:1.0.0
```

Wynik:S
```
Warstwy: 6
REPOSITORY                  TAG     IMAGE ID       SIZE
jmalek623/weather-app       1.0.0   56de6bb8eb81   193MB
```

