# Energía que provee el sol, constante solar (W/m²)
SOLAR = 1360;

#== Cambian a lo largo del año ==#

# Posición angular del sol respecto al plano del ecuador (1.6.1a) en radianes
declinacion = (23.45 * pi / 180) * sin(2 * pi * (284 + n) / 365);

# La distancia de la tierra al sol en AU (1.4.1a)
excentricidad = 1+0.033*cos(2*pi*n/365);

# Ángulo horario de puesta y salida del sol (1.6.10) en radianes
anguloSalida = acos(-tan(latitud)*tan(declinacion));

# Año fraccionario (1.4.2)
anioFrac = (n - 1) * 2 * pi / 365

# Ecuación del tiempo (1.5.3)
ecTiempo = 229.2 * (0.000075 + 0.001868 .* cos(anioFrac) - 0.032077 .* sin(anioFrac) - 0.014615 .* cos(2 .* anioFrac) - 0.04089 .* sin(2 .* anioFrac))

hSolar = (h * 60 + 4 * (zona * pi/12 - longitud) + ecTiempo) / 60

#== Ángulos del sol durante el día ==#

# Ángulo horario centrado en el mediodía
anguloHorario = (hSolar-12)*(pi/12);

# Ángulo cenital del sol (1.6.5) en radianes
anguloCenital = acos(
    cos(latitud) .* cos(declinacion) .* cos(anguloHorario) + sin(latitud) .* sin(declinacion)
);

# Ángulo acimutal del sol (1.6.6) en radianes
acimutSolarParam = abs(acos(
    (cos(anguloCenital).*sin(latitud)-sin(declinacion))
    ./(sin(anguloCenital).*cos(latitud))
));

# La función tiene el mismo signo que el ángulo horario, excepto en 0 para asegurar que al operar trigonométricamente el valor sea el mismo que el de los límites por izquiera y por derecha
acimutSolar = ifelse(anguloHorario < 0, -acimutSolarParam, acimutSolarParam);

# Irradiación

# Media hora antes y media hora después
angulo1 = anguloHorario - pi/24;
angulo2 = anguloHorario + pi/24;

# Irradiación horaria en superficie horizontal a tope de atmósfera  (1.10.4) en kWh/m²

# En MJ/m²
IoJ = (12 * 3600 / pi) * SOLAR * excentricidad * (cos(latitud) * cos(declinacion) * (sin(angulo2) - sin(angulo1)) + (angulo2 - angulo1) * sin(latitud) * sin(declinacion));

# En kW/m²
Io=IoJ/3600000;

# Razón entre la radiación total horaria y diaria (2.13.2)
a = 0.409 + 0.5016 * sin(anguloSalida-pi/3);
b = 0.6609 - 0.4767 * sin(anguloSalida-pi/3);

rt = pi/24 * (a + b * cos(anguloHorario)) .* (cos(anguloHorario) - cos(anguloSalida)) ./ (sin(anguloSalida) - anguloSalida * cos(anguloSalida));

# Irradiación horaria total en superficie horizontal (2.13.1) en kWh/m²
II = H.*rt;


beckman

#pasopaso
