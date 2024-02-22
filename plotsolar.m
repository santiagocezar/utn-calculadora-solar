clear


# mes = 1:12;
# h=6
# mes = 5;

function plotstyle(p)
    # marquitas cada 2 horas
    set(p, 'xtick', 0:2:24);
    # tamaño fuente
    set(p, 'FontName','Noto Sans')
    set(p, 'FontSize',8)
    grid on;
end

function IT = plotirradiacion(h, mes)
    # El día promedio de cada mes
    DiasJulianos = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
    # Irradiación mensual promedio (ND) (kWh/m²)
    Hs = [7.689, 6.804, 5.714, 4.238, 3.323, 2.821, 2.989, 3.805, 5.167, 6.224, 7.244, 7.541];

    MesLabels = {'Enero'; 'Febrero'; 'Marzo'; 'Abril'; 'Mayo'; 'Junio'; 'Julio'; 'Agosto'; 'Septiembre'; 'Octubre'; 'Noviembre'; 'Diciembre'};

    # Hora del día
    # h = 0:.1:24;

    H = Hs(mes);

    # Día
    n = DiasJulianos(mes);

    # Latitud del lugar (en radianes)
    latitud = deg2rad(-31.43);
    # Longitud del lugar (en radianes)
    longitud = deg2rad(-62.08);
    # Diferencia horaria con el GMT (-3 para Argentina, en radianes)
    zona = -3;
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

    return

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


function plotirradiacion12(mes)
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
    latitud = deg2rad(-31.43);
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

ITodo = zeros(24, 12);
for mes = 1:12
    ITodo(:,mes) = max(plotirradiacion(0:23, mes), zeros(1, 24));
end
ITodo
dlmwrite(["tablas/todo.csv"], ITodo, ";");

# subplot(2,2, 1);
# plotirradiacion(0:24, 1);
# subplot(2,2, 2);
# plotirradiacion(0:24, 4);
# subplot(2,2, 3);
# plotirradiacion(0:24, 7);
# subplot(2,2, 4);
# plotirradiacion(0:24, 10);

# plotirradiacion12(1)
# plotirradiacion12(4)
# plotirradiacion12(7)
# plotirradiacion12(12)
# plotirradiacion12(10)

# anguloHorario


#
# [Io, rt, II, kT, Id, Ib, Rb, IT] =
#
# plot(h, [II; kT; Id; Ib; Rb; IT])
