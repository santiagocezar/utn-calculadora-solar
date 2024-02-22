SOLAR = 1360;

# Cambian a lo largo del año
declinacion = (23.45 * pi / 180) * sin(2 * pi * (284 + n) / 365);
excentricidad = 1+0.033*cos(2*pi*n/365);
anguloSalida = acos(-tan(latitud)*tan(declinacion));
horaSalida = anguloSalida/pi * 12;

# Ángulos del sol durante el día
anguloHorario = (h-12)*(pi/12);
anguloCenital = acos(
    cos(latitud) .* cos(declinacion) .* cos(anguloHorario) + sin(latitud) .* sin(declinacion)
);
acimutSolarParam = abs(acos(
    (cos(anguloCenital).*sin(latitud)-sin(declinacion))
    ./(sin(anguloCenital).*cos(latitud))
));

acimutSolar = ifelse(anguloHorario < 0, -acimutSolarParam, acimutSolarParam);

# Irradiación
angulo1 = anguloHorario - pi/24;
angulo2 = anguloHorario + pi/24;
IoJ = (12 * 3600 / pi) * SOLAR * excentricidad * (cos(latitud) * cos(declinacion) * (sin(angulo2) - sin(angulo1)) + (angulo2 - angulo1) * sin(latitud) * sin(declinacion));
Io=IoJ/3600000;

a = 0.409 + 0.5016 * sin(anguloSalida-pi/3);
b = 0.6609 - 0.4767 * sin(anguloSalida-pi/3);

rt = pi/24 * (a + b * cos(anguloHorario)) .* (cos(anguloHorario) - cos(anguloSalida)) ./ (sin(anguloSalida) - anguloSalida * cos(anguloSalida));

II = H.*rt;

# pasopaso
beckman
