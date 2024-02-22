anguloIncidencia = acos(cos(anguloCenital).*cos(inclinacion)+sin(anguloCenital).*sin(inclinacion).*cos(acimutSolar-acimut));

kT = II./Io;

Id = ifelse(kT <= 0.22,
    II .* (1 - 0.09 .* kT), # true
    ifelse(kT < 0.8,
        II .* (0.9511 - 0.1604 .* kT + 4.388 .* kT.^2 - 16.638 .* kT.^3 + 12.336 .* kT.^4), # true
        II .* 0.165 # false
    )
);

Ib = II - Id;

Rb = cos(anguloIncidencia) ./ cos(anguloCenital);
Rb_p = (
    cos(latitud+inclinacion).*cos(declinacion).*cos(anguloHorario)+sin(latitud+inclinacion).*sin(declinacion)
) ./ (
    cos(latitud).*cos(declinacion).*cos(anguloHorario)+sin(latitud).*sin(declinacion)
);
IT = Ib .* Rb + Id .* (1 + cos(inclinacion)) / 2;
