clear

DiasJulianos = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
Hs = [7.689, 6.804, 5.714, 4.238, 3.323, 2.821, 2.989, 3.805, 5.167, 6.224, 7.244, 7.541]; # revisar el valor de marzo
MesLabels = {'Enero'; 'Febrero'; 'Marzo'; 'Abril'; 'Mayo'; 'Junio'; 'Julio'; 'Agosto'; 'Septiembre'; 'Octubre'; 'Noviembre'; 'Diciembre'};

# mes = 1:12;
h=6
h = 0:.1:24;
mes = 1;

# n = 1:365;
H = Hs(mes);
n = DiasJulianos(mes);
MesLabels{mes}

# Parámetros que ingresa el usuario
latitud=deg2rad(-31); # phi
inclinacion=latitud;    # beta
acimut=pi;              # gamma

solar

set(0, 'defaultAxesColorOrder', [
    30, 102, 245
    210, 15, 57
    223, 142, 29
    136, 57, 239
    64, 160, 43
    4, 165, 229
    230, 69, 83
] ./ 255);

function plotstyle(p)
# marquitas cada 2 horas
set(p, 'xtick', 0:2:24);
# tamaño fuente
set(p, 'FontName','Noto Sans')
set(p, 'FontSize',20)
grid on;
end

figure (1);
plot (h, acimutSolar);

figure (2);
plotstyle(gca)
hold on;
plot (h, [Io; II; Id; IT], 'LineWidth',4, '');

# marcar el medio día
plot([12 12], ylim, '--');
hold off;
# solo mostrar valores los valores positivos
axis([0 24 0 inf]);
legend('I_o', 'I', 'I_d', 'I_T');

# anguloHorario

# csvwrite("solar.csv", II.');

#
# [Io, rt, II, kT, Id, Ib, Rb, IT] =
#
# plot(h, [II; kT; Id; Ib; Rb; IT])
