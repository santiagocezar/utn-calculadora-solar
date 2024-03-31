# Coseno del ángulo de incidencia del sol y el panel (1.6.3) en radianes
anguloIncidencia = acos(cos(anguloCenital).*cos(inclinacion)+sin(anguloCenital).*sin(inclinacion).*cos(acimutSolar-acimut));


# Irradiación díaria en superficie horizontal a tope de atmósfera  (1.10.3) en kWh/m²

# En MJ/m²
HoJ = (24 * 3600 / pi) .* SOLAR .* excentricidad .* (cos(latitud) .* cos(declinacion) .* sin(anguloSalida) + anguloSalida .* sin(latitud) .* sin(declinacion));

# En kW/m²
Ho=HoJ/3600000;

# Índice de claridad diario, media mensual (2.9.1)
KT=H/Ho;

# Irradiación diaria difusa, aproximación lineal, media mensual (ecuación de Page)
fDm=1-1.13*KT;
Hd=fDm*H;

Id = Io * Hd / Ho

Ib = II - Id

# Razón de la radiación directa en superficie inclinada y horizontal (1.8.1)
Rb = cos(anguloIncidencia) ./ cos(anguloCenital);

# Irradiación horaria total en superficie inclinada (2.15.1) en kWh/m²
IT = Ib .* Rb + Id .* (1 + cos(inclinacion)) / 2;
