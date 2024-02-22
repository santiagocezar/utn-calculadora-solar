clear


# mes = 1:12;
# h=6
# mes = 5;

function plotstyle(p)
    # marquitas cada 2 horas
    set(p, 'xtick', 0:2:24);
    # tamaño fuente
    set(p, 'FontName','Noto Sans')
    set(p, 'FontSize',16)
    grid on;
end

function plotmonth(mes)
    # El día promedio de cada mes
    DiasJulianos = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
    # Irradiación mensual promedio (ND) (kWh/m²)
    Hs = [7.689, 6.804, 5.714, 4.238, 3.323, 2.821, 2.989, 3.805, 5.167, 6.224, 7.244, 7.541];

    MesLabels = {'Enero'; 'Febrero'; 'Marzo'; 'Abril'; 'Mayo'; 'Junio'; 'Julio'; 'Agosto'; 'Septiembre'; 'Octubre'; 'Noviembre'; 'Diciembre'};

    # Hora del día
    h = 0:.1:24;

    H = Hs(mes);

    # Día
    n = DiasJulianos(mes);

    # Latitud del lugar (en radianes)
    latitud = deg2rad(-31);
    # Inclinación del panel (positivo, en radianes)
    inclinacion = abs(latitud);
    # Acimut del panel (rotación respecto a un eje normal a la tierra, en radianes)
    acimut = pi;

    # Llama al archivo solar.m
    solar

    # Colorinche (tema de colores Catppuccin)
    set(0, 'defaultAxesColorOrder', [
        30, 102, 245
        210, 15, 57
        223, 142, 29
        136, 57, 239
        64, 160, 43
        4, 165, 229
        230, 69, 83
    ] ./ 255);

    # Estilizar gráfico
    plotstyle(gca)
    hold on;
    plot (h, [Io; II; IT], 'LineWidth', 2, '');
    title(MesLabels{mes});
    # plot (h, [Io; II; kT; Id; IT], 'LineWidth', 4, '');

    # marcar el medio día
    plot([12 12], ylim, '--');
    hold off;
    # solo mostrar valores los valores positivos
    axis([0 24 0 1.5]);
    legend('I_o', 'I', 'I_T');
    # legend('I_o', 'I', 'K_T', 'I_d', 'I_T');
end


function plotmonth12(mes)
    # El día promedio de cada mes
    DiasJulianos = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
    # Irradiación mensual promedio (ND) (kWh/m²)
    Hs = [7.689, 6.804, 5.714, 4.238, 3.323, 2.821, 2.989, 3.805, 5.167, 6.224, 7.244, 7.541]; # revisar el valor de marzo
    MesLabels = {'Enero'; 'Febrero'; 'Marzo'; 'Abril'; 'Mayo'; 'Junio'; 'Julio'; 'Agosto'; 'Septiembre'; 'Octubre'; 'Noviembre'; 'Diciembre'};

    # Hora del día
    h = 12;

    H = Hs(mes);

    # Día
    n = DiasJulianos(mes);
    MesLabels{mes}

    # Latitud del lugar (en radianes)
    latitud = deg2rad(-31);
    # Inclinación del panel (positivo, en radianes)
    inclinacion = abs(latitud);
    # Acimut del panel (rotación respecto a un eje normal a la tierra, en radianes)
    acimut = pi;

    # Llama al archivo solar.m
    solar

    II
    IT
    Rb
end

subplot(2,2, 1);
plotmonth(1);
subplot(2,2, 2);
plotmonth(4);
subplot(2,2, 3);
plotmonth(7);
subplot(2,2, 4);
plotmonth(10);

# plotmonth12(1)
# plotmonth12(2)
# plotmonth12(3)
# plotmonth12(4)
# plotmonth12(5)
# plotmonth12(6)
# plotmonth12(7)
# plotmonth12(8)
# plotmonth12(9)
# plotmonth12(10)
# plotmonth12(11)
# plotmonth12(12)

# anguloHorario

# csvwrite("solar.csv", II.');

#
# [Io, rt, II, kT, Id, Ib, Rb, IT] =
#
# plot(h, [II; kT; Id; Ib; Rb; IT])
