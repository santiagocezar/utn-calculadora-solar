
anguloIncidencia = acos(sin(declinacion).*sin(latitud).*cos(inclinacion)
    -sin(declinacion).*cos(latitud).*sin(inclinacion).*cos(acimutSolar)
    +cos(declinacion).*cos(latitud).*cos(inclinacion).*cos(anguloHorario)
    +cos(declinacion).*sin(latitud).*sin(inclinacion).*cos(acimutSolar).*cos(anguloHorario)
    +cos(declinacion).*sin(acimutSolar).*sin(inclinacion).*sin(anguloHorario));

HoJ = (24 * 3600 / pi) * SOLAR * excentricidad * (cos(latitud) * cos(declinacion) * sin(anguloSalida) + anguloSalida * sin(latitud) * sin(declinacion));

Ho=HoJ/3600000;

KT=H/Ho;

fDm=1-1.13*KT;

Hd=fDm*H;
Hb=H - Hd;

anguloHorario2 = anguloHorario + pi / 12

Io = (1 / (3.6 * 10**6)) * (12 * 3600 / pi) * SOLAR * excentricidad * ((cos(latitud) * cos(declinacion) * (sin(anguloHorario2) - sin(anguloHorario))) + ((anguloHorario2 - anguloHorario) * sin(latitud) * sin(declinacion)))

Id = Io * Hd / Ho

Ib = II - Id
Ibn = Ib / cos(anguloCenital);
IT = Ibn * cos(anguloIncidencia) + Id * (1 + cos(inclinacion)) / 2;
