clear


function IT = irradiacionTotal(h, mes)
    # El día promedio de cada mes
    DiasJulianos = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
    # Irradiación mensual promedio (ND) (kWh/m²)
    Hs = [7.689, 6.804, 5.714, 4.238, 3.323, 2.821, 2.989, 3.805, 5.167, 6.224, 7.244, 7.541];

    # Hora del día
    # h = 0:.1:24;

    H = Hs(mes)

    # Día
    n = DiasJulianos(mes);

    # Latitud del lugar (en radianes)
    latitud = deg2rad(-31.43);
    # Longitud del lugar (en radianes)
    longitud = deg2rad(-62.38);
    # Diferencia horaria con el GMT (-3 para Argentina)
    zona = -3;
    # Inclinación del panel (positivo, en radianes)
    inclinacion = latitud;
    # Acimut del panel (rotación respecto a un eje normal a la tierra, en radianes)
    acimut = 0;

    # Llama al archivo solar.m
    solar

    IT = max(zeros(size(IT)), IT);

end

function [IT, W] = generada(h, mes)
    IT = irradiacionTotal(h, mes);

    cantidadPaneles = 12
    superficiePorPanel = 1.653*0.992

    eficienciaPanel = .142
    eficienciaInversor = .95

    eficienciaInstalacion = .90

    superficie = cantidadPaneles * superficiePorPanel

    W = IT * superficie * eficienciaPanel * eficienciaInversor * eficienciaInstalacion
end

function plotstyle(p)
    # marquitas cada 2 horas
    set(p, 'xtick', 0:2:24);
    # tamaño fuente
    set(p, 'FontName','Noto Sans')
    set(p, 'FontSize',8)
    grid on;
end



function IT = plotirradiacion(h, mes, radio)
    IT = irradiacionTotal(h, mes);

    MesLabels = {'Enero'; 'Febrero'; 'Marzo'; 'Abril'; 'Mayo'; 'Junio'; 'Julio'; 'Agosto'; 'Septiembre'; 'Octubre'; 'Noviembre'; 'Diciembre'};

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

    # figure(mes)
    # Estilizar gráfico
    cla(gca);
    plotstyle(gca)
    hold on;
    plot (h, [IT; radio], 'LineWidth', 2, '');
    title(MesLabels{mes});
    # plot (h, [Io; II; kT; Id; IT], 'LineWidth', 4, '');

    # marcar el medio día
    plot([12 12], ylim, '--');
    hold off;
    # solo mostrar valores los valores positivos
    axis([0 24 0 1.5]);
    legend('I_T', 'I_T medido');
    # legend('I_o', 'I', 'K_T', 'I_d', 'I_T');

end


function W = plotgeneracion(h, mes)
    [IT, W] = generada(h, mes);

    MesLabels = {'Enero'; 'Febrero'; 'Marzo'; 'Abril'; 'Mayo'; 'Junio'; 'Julio'; 'Agosto'; 'Septiembre'; 'Octubre'; 'Noviembre'; 'Diciembre'};

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

    # figure(mes)
    # Estilizar gráfico
    cla(gca);
    plotstyle(gca)
    hold on;
    plot (h, [W; IT], 'LineWidth', 2, '');
    title(MesLabels{mes});
    # plot (h, [Io; II; kT; Id; IT], 'LineWidth', 4, '');

    # marcar el medio día
    plot([12 12], ylim, '--');
    hold off;
    # solo mostrar valores los valores positivos
    axis([0 24 0 3]);
    legend('Generada', 'I_T');
    # legend('I_o', 'I', 'K_T', 'I_d', 'I_T');

end

function plotirradiacion12(mes)
    irradiacionTotal(12, mes)
end

function graficar3D()
    [mes, h] = meshgrid(1:12, 0:23)

    IT = irradiacionTotal(h, mes)

    mesh(h, mes, IT)
    xlabel("Hora")
    xlabel("Mes")
    xlabel("I_t")
end

function exportarCSVElectricidad()
    WTodo = zeros(24, 12);
    for mes = 1:12
        [IT, W] = generada(0:23, mes)
        WTodo(:,mes) = max(W, zeros(1, 24));
    end
    WTodo
    dlmwrite(["tablas/todo.csv"], WTodo, ";");
end

# exportarCSVElectricidad
#
# ITR = csvread("tablas/radiometro.csv") ./ 1000;
# plotmes = [2 5 8 11]
#
# for i = 1:4
#     mes = plotmes(i)
#     subplot(2,2, i);
#     plotirradiacion(0:23, mes, ITR(:,mes).');
# end

plotmes = [2 5 8 11]


[IT, W] = generada(0:23, 1);
sum(W)

for i = 1:4
    mes = plotmes(i)
    subplot(2,2, i);
    plotgeneracion(0:23, mes);
end

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
