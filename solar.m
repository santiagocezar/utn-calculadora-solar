SOLAR = 1360;

# Cambian a lo largo del año
declinacion = (23.45 * pi / 180) * sin(2 * pi * (284 + n) / 365);
excentricidad = 1+0.033*cos(2*pi*n/365);
anguloSalida = acos(-tan(latitud)*tan(declinacion));
horaSalida = anguloSalida/pi * 12;

# Ángulos del sol durante el día
anguloHorario = (h-12)*(pi/12);
anguloCenital = acos(
    cos(latitud) * cos(declinacion) * cos(anguloHorario) + sin(latitud) * sin(declinacion)
);
acimutSolarParam = abs(acos(
    (cos(anguloCenital)*sin(latitud)-sin(declinacion))
    ./(sin(anguloCenital)*cos(latitud))
));

acimutSolar = merge(anguloHorario < 0, -acimutSolarParam, acimutSolarParam);
# acimutSolar = arrayfun(@(g) anguloHorario < 0 && -g || g, acimutSolarParam);

anguloIncidencia=acos(cos(anguloCenital).*cos(inclinacion)+sin(anguloCenital).*sin(inclinacion).*cos(acimutSolar-acimut));

# Irradiación
angulo1 = anguloHorario - pi/24;
angulo2 = anguloHorario + pi/24;
IoJ = (12 * 3600 / pi) * SOLAR * excentricidad * (cos(latitud) * cos(declinacion) * (sin(angulo2) - sin(angulo1)) + (angulo2 - angulo1) * sin(latitud) * sin(declinacion));
Io=IoJ/3600000;

a = 0.409 + 0.5016 * sin(anguloSalida-pi/3);
b = 0.6609 - 0.4767 * sin(anguloSalida-pi/3);

rt = pi/24 * (a + b * cos(anguloHorario)) .* (cos(anguloHorario) - cos(anguloSalida)) / (sin(anguloSalida) - anguloSalida * cos(anguloSalida));

II = H*rt;

# HoJ = (24 * 3600 / pi) * SOLAR * excentricidad * (cos(latitud) * cos(declinacion) * sin(anguloSalida) + anguloSalida * sin(latitud) * sin(declinacion));
# Ho=HoJ/3600000;
#
# KT=H/Ho;
#
# fDm=1-1.13*KT;
#
# Hd=fDm*H;
# Id = Io * Hd / Ho;
#

kT = II/Io;
Id = II * 0.165

if (kT <= 0.22)
    Id = II * (1 - 0.09 * kT)
elseif (kT < 0.8)
    Id = II * (0.9511 - 0.1604 * kT + 4.388 * kT^2 - 16.638 * kT^3 + 12.336 * kT^4)
end
Ib = II - Id;

Rb = cos(anguloIncidencia) / cos(anguloCenital);
IT = Ib * Rb + Id * (1 + cos(inclinacion)) / 2;

# Ibn = Ib / cos(anguloCenital);

# sin(D) * sin(L) * cos(B))
# - (sin(D) * cos(L) * sin(B) * cos(gamma))
# + (cos(D) * cos(L) * cos(B) * cos(W))
# + (cos(D) * sin(L) * sin(B) * cos(gamma) * cos(W))
# + (cos(D) * sin(gamma) * sin(B) * sin(W)

# cosAnguloIncidencia2=sin(declinacion).*sin(latitud).*cos(inclinacion)
# -sin(declinacion).*cos(latitud).*sin(inclinacion).*cos(acimutSolar)
# +cos(declinacion).*cos(latitud).*cos(inclinacion).*cos(anguloHorario)
# +cos(declinacion).*sin(latitud).*sin(inclinacion).*cos(acimutSolar).*cos(anguloHorario)
# +cos(declinacion).*sin(acimutSolar).*sin(inclinacion).*sin(anguloHorario);

# IT = Ib * Rb + Id * (1 + cos(inclinacion)) / 2;
# IT = Ibn * cosAnguloIncidencia2 + Id * (1 + cos(inclinacion)) / 2;

# Difusa de la guía
# anguloIncidencia2=sin(declinacion)*sin(latitud)*cos(inclinacion)-sin(declinacion)*cos(latitud)*sin(inclinacion)*cos(acimut)+cos(declinacion)*cos(latitud)*cos(inclinacion)*cos(anguloHorario)+cos(declinacion)*sin(latitud)*sin(inclinacion)*cos(acimut)*cos(anguloHorario)+cos(declinacion)*sin(acimut)*sin(inclinacion)*sin(anguloHorario);
#
#
# (* ::Input:: *)
# (*Manipulate(*)
# (*Block({n=DiasJulianos((mes)) H=Hs((mes))}*)
# (*Plot({anguloHorarioanguloCenitalcos(anguloCenital)acimutSolaranguloIncidencia cos(anguloIncidencia) anguloIncidencia2}{h0 24}*)
# (*PlotLabel->'\(CapitalAAcute)ngulos solares durante 24 horas'*)
# (*PlotLegends-> {'\(CapitalAAcute)ngulo horario' '\(CapitalAAcute)ngulo anguloCenitalal' 'coseno del \(AAcute)ngulo anguloCenitalal' '\(CapitalAAcute)ngulo acimutal' '\(CapitalAAcute)ngulo de anguloIncidencia con el panel' 'cos(theta_i)' 'cos(theta_i) 2'}*)
# (*PlotHighlighting->'XSlice'*)
# (*)*)
# (*)*)
# (*{mes 1 121}*)
# (*)*)
#
#
# (* ::Input:: *)
# (*Manipulate(*)
# (*Block({n=DiasJulianos((mes)) H=Hs((mes))}*)
# (*Plot({cos(anguloIncidencia) anguloIncidencia2}{h0 24}*)
# (*PlotLabel->'comparaci\(OAcute)n'*)
# (*PlotLegends-> {'cos(theta_i)' 'cos(theta_i) 2'}*)
# (*PlotHighlighting->'XSlice'*)
# (*)*)
# (*)*)
# (*{mes 1 121}*)
# (*)*)
#
#
# (* ::Subtitle:: *)
# (*Valores de irradiaci\(OAcute)n*)
#
#
# (* ::Input::Initialization:: *)

# (* ::Input:: *)
# (*Manipulate(*)
# (*Block({n=DiasJulianos((mes)) H=Hs((mes))}*)
# (*Plot({Io II Id IT}{h 12-horaSalida12+horaSalida}*)
# (*PlotLabel->'Irradiaci\(OAcute)n horaria en superficie horizontal'*)
# (*PlotLegends->{'A tope de atm\(OAcute)sfera' 'En tierra' 'Difusa' 'Total'}*)
# (*PlotHighlighting->'XSlice'*)
# (*)*)
# (*)*)
# (*{mes 1 121}*)
# (*)*)
# (**)
# (*BarChart(*)
# (*Block({n=#((1)) H=#((2)) h=12} Ibn) &/@Transpose({DiasJulianos Hs})*)
# (*ChartLabels->Placed(MesLabels Axis Rotate(# -pi/2)&)*)
# (*)*)
#
#
