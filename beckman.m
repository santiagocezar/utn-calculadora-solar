# Coseno del ángulo de incidencia del sol y el panel (1.6.3) en radianes
anguloIncidencia = acos(cos(anguloCenital).*cos(inclinacion)+sin(anguloCenital).*sin(inclinacion).*cos(acimutSolar-acimut));

# Índice de claridad horario (2.9.3)
kT = II./Io;

# Irradiación horaria difusa (2.10.1) en kWh/m²
Id = ifelse(kT <= 0.22,
    II .* (1 - 0.09 .* kT), # true
    ifelse(kT < 0.8,
        II .* (0.9511 - 0.1604 .* kT + 4.388 .* kT.^2 - 16.638 .* kT.^3 + 12.336 .* kT.^4), # true
        II .* 0.165 # false
    )
);

# Irradiación horaria directa, sección 2.10, es la porción de irradiación total que no es difusa
Ib = II - Id;

# Razón de la radiación directa en superficie inclinada y horizontal (1.8.1)
Rb = cos(anguloIncidencia) ./ cos(anguloCenital);
Rb_p = (
    cos(latitud+inclinacion).*cos(declinacion).*cos(anguloHorario)+sin(latitud+inclinacion).*sin(declinacion)
) ./ (
    cos(latitud).*cos(declinacion).*cos(anguloHorario)+sin(latitud).*sin(declinacion)
);

# Irradiación horaria total en superficie inclinada (2.15.1) en kWh/m²
IT = Ib .* Rb + Id .* (1 + cos(inclinacion)) / 2;
