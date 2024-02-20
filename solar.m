clear

SOLAR = 1360;
DiasJulianos = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
Hs = [7.689, 6.804, 5.714, 4.238, 3.323, 2.821, 2.989, 3.805, 5.167, 6.224, 7.244, 7.541];
MesLabels = ['Enero'; 'Febrero'; 'Marzo'; 'Abril'; 'Mayo'; 'Junio'; 'Julio'; 'Agosto'; 'Septiembre'; 'Octubre'; 'Noviembre'; 'Diciembre'];

h = 0:24;
mes = 1:12;

n = DiasJulianos(mes);

# Parámetros que ingresa el usuario
latitud=deg2rad(-31.4); # phi
inclinacion=latitud;    # beta
acimut=pi;              # gamma

# Cambian a lo largo del año
declinacion=(23.45*pi/180)*sin(2*pi*(284+n)/365); # delta
excentricidad = 1+0.033*cos(2*pi*n/365);
anguloSalida=acos(-tan(latitud)*tan(declinacion));
horaSalida = anguloSalida/pi * 12;

# Ángulos del sol durante el día


# anguloSolar=(h-12)pi/12;
# cenit=acos( cos(latitud)cos(declinacion)cos(anguloSolar)+sin(latitud)sin(declinacion));
# acimutSolar=If(anguloSolar<0-11)Abs(acos((cos(cenit)sin(latitud)-sin(declinacion))/(sin(cenit)cos(latitud))));
# incidencia=acos(cos(cenit)cos(inclinacion)+sin(cenit)sin(inclinacion)cos(acimutSolar-acimut));
# incidencia2=sin(declinacion)*sin(latitud)*cos(inclinacion)-sin(declinacion)*cos(latitud)*sin(inclinacion)*cos(acimut)+cos(declinacion)*cos(latitud)*cos(inclinacion)*cos(anguloSolar)+cos(declinacion)*sin(latitud)*sin(inclinacion)*cos(acimut)*cos(anguloSolar)+cos(declinacion)*sin(acimut)*sin(inclinacion)*sin(anguloSolar);
#
#
# (* ::Input:: *)
# (*Manipulate(*)
# (*Block({n=DiasJulianos((mes)) H=Hs((mes))}*)
# (*Plot({anguloSolarcenitcos(cenit)acimutSolarincidencia cos(incidencia) incidencia2}{h0 24}*)
# (*PlotLabel->'\(CapitalAAcute)ngulos solares durante 24 horas'*)
# (*PlotLegends-> {'\(CapitalAAcute)ngulo horario' '\(CapitalAAcute)ngulo cenital' 'coseno del \(AAcute)ngulo cenital' '\(CapitalAAcute)ngulo acimutal' '\(CapitalAAcute)ngulo de incidencia con el panel' 'cos(theta_i)' 'cos(theta_i) 2'}*)
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
# (*Plot({cos(incidencia) incidencia2}{h0 24}*)
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
# angulo1=anguloSolar-pi/24;angulo2=anguloSolar+pi/24;
# IoJ=(12*3600/pi)*SOLAR*excentricidad(cos(latitud)cos(declinacion)(sin(angulo2)-sin(angulo1))+(angulo2-angulo1)sin(latitud)sin(declinacion));
# Io=IoJ/3600000;
#
# a=0.409+0.5016sin(anguloSalida-pi/3); b=0.6609-0.4767sin(anguloSalida-pi/3);
# rt=pi/24*(a+b*cos(anguloSolar))*(cos(anguloSolar)-cos(anguloSalida))/(sin(anguloSalida)-anguloSalida*cos(anguloSalida));
# II=H*rt;
# kT=II/Io;
# Id =II*Which(kT<=0.221-0.09kTkT<=0.800.9511-0.1604kT+4.388kT^2-16.638kT^3+12.336kT^4True0.165);
# Ib=II-Id;
# Rb=cos(incidencia)/cos(cenit);
# Ibn =Ib/cos(cenit);
# IT=Ib*Rb+Id*(1+cos(inclinacion))/2;
# (* Difusa de la gu\(IAcute)a *)
# HoJ=(24*3600/pi)*SOLAR*excentricidad(cos(latitud)*cos(declinacion)*sin(anguloSalida)+anguloSalida*sin(latitud)sin(declinacion));
# Ho=HoJ/3600000;
# KT=H/Ho;
# fDm=1-1.13KT;
# Hd=fDm*H;
#
#
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
